export interface ProjectEvidenceMetric {
  label: string;
  value: string;
  type?: "performance" | "time-saved" | "workflow-steps" | "tests" | "measurements";
  evidenceNotes?: string;
}

export interface Project {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: "AI Application" | "Agentic Workflow" | "Automation" | "Web System" | "Prototype";
  technologies: string[];
  tools: string[];
  image: string;
  gallery?: string[];
  liveUrl?: string;
  githubUrl?: string;
  status: "In Development" | "Shipped" | "Experimental";
  featured: boolean;
  date: string;
  problem: string;
  approach: string;
  architecture?: string[];
  result: string;
  lessons: string;
  metrics?: ProjectEvidenceMetric[];
}

export interface LabExperiment {
  id: string;
  title: string;
  state: "SYSTEM IN DEVELOPMENT" | "AUTOMATION EXPERIMENT" | "AGENT WORKFLOW" | "WEB EXPERIENCE" | "BUILD LOG";
  category: "AI Application" | "Agentic Workflow" | "Automation" | "Web System" | "Prototype";
  description: string;
  techStack: string[];
}

/**
 * Real Projects Catalog
 * NOTE: Strict authentic content invariant — no completed client projects or fake stats are fabricated.
 * Populating this array will automatically render live case study cards and evidence metrics across the UI.
 */
export const projectsData: Project[] = [];

/**
 * The Lab: Things I'm building, testing, breaking, and learning from.
 * Pure experiments in progress. Transparently labeled so visitors see real active engineering.
 */
export const experimentsData: LabExperiment[] = [];

export function getFeaturedProjects(): Project[] {
  return projectsData.filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projectsData.find((p) => p.slug === slug);
}
