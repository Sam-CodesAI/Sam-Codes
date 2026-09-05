export interface Milestone {
  id: string;
  category: "HACKATHONS" | "OPEN SOURCE" | "PROJECTS" | "CERTIFICATIONS" | "COMMUNITIES" | "ACADEMIC" | "OTHER";
  title: string;
  organizationOrEvent: string;
  date: string;
  description: string;
  url?: string;
}

/**
 * Milestones Data
 * Ready to receive achievements, hackathons, open source milestones, and recognitions as they occur.
 * The Milestone section in the UI dynamically renders only when real milestone entries exist.
 */
export const milestonesData: Milestone[] = [];
