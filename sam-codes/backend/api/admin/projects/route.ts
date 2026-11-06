import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth-service";
import { getProjects, getProjectById, saveProject, deleteProject, ExtendedProject } from "@/lib/data-service";

export async function GET(req: NextRequest) {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      const project = await getProjectById(id);
      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
      return NextResponse.json({ project });
    }

    const projects = await getProjects(true);
    return NextResponse.json({ projects });
  } catch (err) {
    console.error("Error fetching projects:", err);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await verifyAdminSession();
  if (!session.authenticated || !session.user) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.title || !body.slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    const project: ExtendedProject = {
      id: body.id || `proj-${Date.now()}`,
      slug: body.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-"),
      title: body.title.trim(),
      shortDescription: body.shortDescription?.trim() || "",
      fullDescription: body.fullDescription?.trim() || "",
      category: body.category || "AI Application",
      status: body.status || "DRAFT",
      featured: Boolean(body.featured),
      date: body.date || new Date().toISOString().split("T")[0],
      problem: body.problem?.trim() || "",
      approach: body.approach?.trim() || "",
      architecture: Array.isArray(body.architecture) ? body.architecture : [],
      technologies: Array.isArray(body.technologies) ? body.technologies : [],
      tools: Array.isArray(body.tools) ? body.tools : [],
      result: body.result?.trim() || "",
      lessons: body.lessons?.trim() || "",
      metrics: Array.isArray(body.metrics) ? body.metrics : [],
      image: body.image || "",
      liveUrl: body.liveUrl || undefined,
      githubUrl: body.githubUrl || undefined,
    };

    const saved = await saveProject(project, session.user.email);
    return NextResponse.json({ success: true, project: saved });
  } catch (err) {
    console.error("Error saving project:", err);
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await verifyAdminSession();
  if (!session.authenticated || !session.user) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
  }

  try {
    await deleteProject(id, session.user.email);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting projects:", err);
    return NextResponse.json({ error: "Failed to delete projects" }, { status: 500 });
  }
}
