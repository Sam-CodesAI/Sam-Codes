export interface SocialLink {
  platform: string;
  url: string;
  handleOrLabel: string;
  ariaLabel: string;
  iconName: "Instagram" | "Linkedin" | "Twitter" | "Reddit" | "Mail";
  directActionLabel: string;
  priorityBadge?: string;
}

/**
 * Social Links & Contact Channels
 * Prominently prioritized for immediate direct messaging, collaboration, and project inquiries.
 */
export const socialsData: SocialLink[] = [
  {
    platform: "X (Twitter)",
    url: "https://x.com",
    handleOrLabel: "@samcodes",
    ariaLabel: "Direct Message Sam on X (Twitter)",
    iconName: "Twitter",
    directActionLabel: "Send a DM on X",
    priorityBadge: "Fastest Response",
  },
  {
    platform: "Instagram",
    url: "https://instagram.com",
    handleOrLabel: "@samcodes",
    ariaLabel: "DM Sam on Instagram",
    iconName: "Instagram",
    directActionLabel: "DM on Instagram",
    priorityBadge: "DMs Always Open",
  },
  {
    platform: "LinkedIn",
    url: "https://linkedin.com/in/samarth-nimangre",
    handleOrLabel: "Samarth Nimangre",
    ariaLabel: "Connect with Samarth on LinkedIn",
    iconName: "Linkedin",
    directActionLabel: "Connect on LinkedIn",
    priorityBadge: "Professional",
  },
  {
    platform: "Reddit",
    url: "https://reddit.com/user/samcodes",
    handleOrLabel: "u/samcodes",
    ariaLabel: "Message Sam on Reddit",
    iconName: "Reddit",
    directActionLabel: "Chat on Reddit",
  },
  {
    platform: "Email",
    url: "mailto:contact@samcodes.dev",
    handleOrLabel: "contact@samcodes.dev",
    ariaLabel: "Send a direct email to Sam",
    iconName: "Mail",
    directActionLabel: "Copy Direct Email",
    priorityBadge: "Proposals & RFPs",
  },
];
