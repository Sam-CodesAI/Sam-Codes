/**
 * SutraDB Zero-Dependency TypeScript Client (v2.0.0)
 * Communicates with the SutraDB ASGI server over HTTP/1.1 and HTTP/2 with
 * timeout protection, health probes, and full hybrid search query execution.
 */

export interface SutraClientConfig {
  baseUrl?: string;
  apiKey?: string;
  timeoutMs?: number;
}

export interface SutraCreateCollectionParams {
  name: string;
  dimension: number;
  metric?: "cosine" | "euclidean" | "dot";
  enable_wal?: boolean;
}

export interface SutraDocumentInput {
  id?: string;
  text?: string;
  vector?: number[];
  metadata?: Record<string, unknown>;
}

export interface SutraQueryOptions {
  text?: string;
  vector?: number[];
  filter?: Record<string, unknown>;
  top_k?: number;
  hybrid?: boolean;
  alpha?: number;
  rrf_constant?: number;
  dense_weight?: number;
  bm25_weight?: number;
  use_ann?: boolean;
}

export interface SutraQueryResultItem {
  id: string;
  score: number;
  text?: string;
  metadata?: Record<string, unknown>;
  dense_score?: number;
  bm25_score?: number;
}

export interface SutraQueryResponse {
  count: number;
  results: SutraQueryResultItem[];
  latency_ms?: number;
}

export class SutraClient {
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly timeoutMs: number;

  constructor(config: SutraClientConfig = {}) {
    let resolvedUrl = config.baseUrl;
    if (!resolvedUrl && typeof process !== "undefined" && process.env?.SUTRADB_URL) {
      resolvedUrl = process.env.SUTRADB_URL;
    }
    this.baseUrl = (resolvedUrl || "http://127.0.0.1:8000").replace(/\/$/, "");
    this.apiKey =
      config.apiKey ||
      (typeof process !== "undefined" ? process.env?.SUTRADB_API_KEY : undefined);
    this.timeoutMs = config.timeoutMs ?? 3000;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => controller.abort(), this.timeoutMs);

    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(options.headers as Record<string, string> | undefined),
    };

    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      if (!response.ok) {
        let errorDetail = `HTTP ${response.status} ${response.statusText}`;
        try {
          const errJson = (await response.json()) as Record<string, unknown>;
          if (errJson && typeof errJson === "object") {
            const detail = errJson["detail"] || errJson["error"];
            if (typeof detail === "string") {
              errorDetail = detail;
            }
          }
        } catch {
          // Non-JSON error body fallback
        }
        throw new Error(`[SutraClient] Request failed (${response.status}): ${errorDetail}`);
      }

      return (await response.json()) as T;
    } finally {
      clearTimeout(timeoutTimer);
    }
  }

  public async health(): Promise<{
    status: string;
    version: string;
    collections: string[];
  }> {
    return this.request<{
      status: string;
      version: string;
      collections: string[];
    }>("/health", { method: "GET" });
  }

  public async listCollections(): Promise<{ collections: string[] }> {
    return this.request<{ collections: string[] }>("/collections", {
      method: "GET",
    });
  }

  public async createCollection(
    params: SutraCreateCollectionParams
  ): Promise<{ message: string; stats: Record<string, unknown> }> {
    return this.request<{ message: string; stats: Record<string, unknown> }>("/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
  }

  public async insert(
    collectionName: string,
    documents: SutraDocumentInput[]
  ): Promise<{ inserted: number; total_count: number }> {
    return this.request<{ inserted: number; total_count: number }>(
      `/collections/${encodeURIComponent(collectionName)}/documents`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documents }),
      }
    );
  }

  public async query(
    collectionName: string,
    options: SutraQueryOptions
  ): Promise<SutraQueryResponse> {
    return this.request<SutraQueryResponse>(
      `/collections/${encodeURIComponent(collectionName)}/query`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options),
      }
    );
  }
}
