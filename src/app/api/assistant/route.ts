import { NextRequest, NextResponse } from "next/server";
import { SutraClient } from "@/lib/sutradb/client";
import {
  queryDeterministicAssistant,
  assistantKnowledgeBase,
} from "@/data/assistantKnowledge";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { query?: unknown };
    const query = typeof body?.query === "string" ? body.query.trim() : "";

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required." },
        { status: 400 }
      );
    }

    // Tier 1: Semantic RAG over SutraDB (v2.0 Vector Core)
    const sutraUrl = process.env.SUTRADB_URL;
    if (sutraUrl) {
      try {
        const client = new SutraClient({
          baseUrl: sutraUrl,
          apiKey: process.env.SUTRADB_API_KEY,
          timeoutMs: 1500,
        });

        const queryResult = await client.query("portfolio_knowledge", {
          text: query,
          top_k: 1,
          hybrid: true,
        });

        if (queryResult.results && queryResult.results.length > 0) {
          const top = queryResult.results[0];
          if (top.score >= 0.40 && top.text) {
            return NextResponse.json({
              answer: top.text,
              source: "sutradb",
              confidence: top.score,
              latency_ms: queryResult.latency_ms ?? 0,
            });
          }
        }
      } catch {
        // Fall through to deterministic grounding on network/engine failure
      }
    }

    // Tier 2: Deterministic Verified Grounding Fallback
    const fallbackAnswer = queryDeterministicAssistant(query, assistantKnowledgeBase);
    return NextResponse.json({
      answer: fallbackAnswer,
      source: "deterministic_fallback",
      confidence: 1.0,
      latency_ms: 0,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
