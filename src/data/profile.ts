export interface ProfileData {
  brandName: string;
  preferredName: string;
  fullName: string;
  title: string;
  location: string;
  identityTags: string[];
  heroHeadline: string;
  heroSubheadline: string;
  statementHeadline: string;
  statementDescription: string;
  aboutStory: string[];
  availabilityStatus: string;
}

export const profileData: ProfileData = {
  brandName: "SAM CODES",
  preferredName: "Sam",
  fullName: "Samarth Nimangre",
  title: "AI Developer · Automation Builder · Digital Creator",
  location: "Karnataka, India",
  identityTags: [
    "Student",
    "AI Developer",
    "Automation Builder",
    "Digital Creator",
    "AI-Native Systems",
  ],
  heroHeadline: "Building intelligent digital experiences.",
  heroSubheadline:
    "Turning ambitious ideas into functional digital systems through AI applications, agentic workflows, business automations, and modern web engineering.",
  statementHeadline: "I turn ideas into intelligent digital systems.",
  statementDescription:
    "By combining modern AI development tools, automation pipelines, and robust web engineering, I explore how software can work for us — building systems that are intuitive, fast, and practical.",
  aboutStory: [
    "I'm Sam — a student and AI-native builder based in Karnataka, India.",
    "I'm fascinated by what happens when human creativity, modern generative models, automation workflows, and elegant code intersect. Rather than building for the sake of complexity, I focus on understanding the core problem and designing the simplest, most intelligent system to solve it.",
    "From rapid prototypes and autonomous agents to business automation and high-performance interfaces, I build with curiosity, velocity, and an experimental mindset.",
  ],
  availabilityStatus: "Available for interesting projects and collaborative building",
};
