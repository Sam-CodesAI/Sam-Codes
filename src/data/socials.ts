export interface SocialLink {
  platform: string;
  url: string;
  handleOrLabel: string;
  ariaLabel: string;
  iconName: "Instagram" | "Linkedin" | "Twitter" | "Reddit" | "Mail";
  isPlaceholder: boolean;
}

/**
 * Social Links Configuration
 * Replace the placeholder values with your real profiles as you activate them.
 * This centralized configuration automatically updates throughout the entire site.
 */
export const socialsData: SocialLink[] = [
  {
    platform: "Instagram",
    url: "INSTAGRAM_URL",
    handleOrLabel: "@samcodes",
    ariaLabel: "Follow Sam on Instagram",
    iconName: "Instagram",
    isPlaceholder: true,
  },
  {
    platform: "LinkedIn",
    url: "LINKEDIN_URL",
    handleOrLabel: "Samarth Nimangre",
    ariaLabel: "Connect with Sam on LinkedIn",
    iconName: "Linkedin",
    isPlaceholder: true,
  },
  {
    platform: "X (Twitter)",
    url: "X_URL",
    handleOrLabel: "@samcodes",
    ariaLabel: "Follow Sam on X (Twitter)",
    iconName: "Twitter",
    isPlaceholder: true,
  },
  {
    platform: "Reddit",
    url: "REDDIT_URL",
    handleOrLabel: "u/samcodes",
    ariaLabel: "Connect with Sam on Reddit",
    iconName: "Reddit",
    isPlaceholder: true,
  },
  {
    platform: "Email",
    url: "mailto:contact@samcodes.dev",
    handleOrLabel: "contact@samcodes.dev",
    ariaLabel: "Send an email to Sam",
    iconName: "Mail",
    isPlaceholder: false,
  },
];
