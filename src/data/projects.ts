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
  result: string;
  lessons: string;
  metrics?: { label: string; value: string }[];
}

/**
 * Projects Array
 * NOTE: As per SAM CODES strict authentic content policy, no completed projects are fabricated.
 * This array is ready to be populated as Sam builds and documents new projects.
 */
export const projectsData: Project[] = [];

export function getFeaturedProjects(): Project[] {
  return projectsData.filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projectsData.find((p) => p.slug === slug);
}
