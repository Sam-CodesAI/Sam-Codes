import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-service";
import { getServices, saveService, deleteService, ServiceOffering } from "@/lib/data-service";

export async function GET() {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const services = await getServices();
  return NextResponse.json({ services });
}

export async function POST(req: NextRequest) {
  const session = await verifyAdminSession();
  if (!session.authenticated || !session.user) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title || !body.id) {
      return NextResponse.json({ error: "Service title and ID are required" }, { status: 400 });
    }

    const service: ServiceOffering = {
      id: body.id.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-"),
      title: body.title.trim(),
      tagline: body.tagline?.trim() || "",
      description: body.description?.trim() || "",
      deliverables: Array.isArray(body.deliverables) ? body.deliverables : [],
    };

    const saved = await saveService(service, session.user.email);
    return NextResponse.json({ success: true, service: saved });
  } catch (err) {
    console.error("Error saving service:", err);
    return NextResponse.json({ error: "Failed to save service" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await verifyAdminSession();
  if (!session.authenticated || !session.user) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Service ID required" }, { status: 400 });

  await deleteService(id, session.user.email);
  return NextResponse.json({ success: true });
}
