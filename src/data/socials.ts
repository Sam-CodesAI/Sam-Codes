export interface SocialLink {
  platform: string;
  url: string;
  handleOrLabel: string;
  ariaLabel: string;
  iconName: "Instagram" | "Linkedin" | "Twitter" | "Reddit" | "Github" | "Mail";
  directActionLabel: string;
  priorityBadge?: string;
  description?: string;
}

/**
 * Centralized Contact & Socials Configuration
 * Update these constants whenever handles, URLs, or email addresses change.
 */
export const CONTACT_CONFIG = {
  INSTAGRAM_URL: "https://www.instagram.com/samarth.buildss/",
  INSTAGRAM_HANDLE: "@samarth.buildss",

  LINKEDIN_URL: "https://www.linkedin.com/in/samarth-nimangre-0a3b02421/",
  LINKEDIN_LABEL: "Samarth Nimangre",

  // X (Twitter) URL & Handle - easily updated when brand handle changes
  X_URL: "https://x.com/Tempest_Store",
  X_HANDLE: "@Tempest_Store",

  REDDIT_URL: "https://www.reddit.com/u/SamarthBuilds_/",
  REDDIT_HANDLE: "u/SamarthBuilds_",

  GITHUB_URL: "https://github.com/Sam-CodesAI",
  GITHUB_HANDLE: "Sam-CodesAI",

  // Primary contact email address
  EMAIL_ADDRESS: "samarthknimangre@gmail.com",
  EMAIL_LABEL: "samarthknimangre@gmail.com",
  EMAIL_IS_VERIFIED: true,
};

/**
 * Contact pathways ordered by priority:
 * 1. Instagram
 * 2. LinkedIn
 * 3. X
 * 4. Reddit
 * 5. GitHub
 * 6. Email
 */
export const socialsData: SocialLink[] = [
  {
    platform: "Instagram",
    url: CONTACT_CONFIG.INSTAGRAM_URL,
    handleOrLabel: CONTACT_CONFIG.INSTAGRAM_HANDLE,
    ariaLabel: "Message Sam on Instagram",
    iconName: "Instagram",
    directActionLabel: "DM on Instagram",
    priorityBadge: "Top Preference",
    description: "Fastest response for project chats, ideas, and quick questions",
  },
  {
    platform: "LinkedIn",
    url: CONTACT_CONFIG.LINKEDIN_URL,
    handleOrLabel: CONTACT_CONFIG.LINKEDIN_LABEL,
    ariaLabel: "Connect with Samarth on LinkedIn",
    iconName: "Linkedin",
    directActionLabel: "Connect on LinkedIn",
    priorityBadge: "Professional",
    description: "For client engagements, academic discussions, and professional network",
  },
  {
    platform: "X (Twitter)",
    url: CONTACT_CONFIG.X_URL,
    handleOrLabel: CONTACT_CONFIG.X_HANDLE,
    ariaLabel: "Message Sam on X (Twitter)",
    iconName: "Twitter",
    directActionLabel: "Send a DM on X",
    priorityBadge: "DMs Open",
    description: "Tech discussions, build progress, and direct messaging",
  },
  {
    platform: "Reddit",
    url: CONTACT_CONFIG.REDDIT_URL,
    handleOrLabel: CONTACT_CONFIG.REDDIT_HANDLE,
    ariaLabel: "Message Sam on Reddit",
    iconName: "Reddit",
    directActionLabel: "Chat on Reddit",
    description: "Builder community, discussions, and open-source feedback",
  },
  {
    platform: "GitHub",
    url: CONTACT_CONFIG.GITHUB_URL,
    handleOrLabel: CONTACT_CONFIG.GITHUB_HANDLE,
    ariaLabel: "View Sam's GitHub Profile",
    iconName: "Github",
    directActionLabel: "View Repositories",
    description: "Open source code, repositories, and build activity",
  },
  {
    platform: "Email",
    url: `mailto:${CONTACT_CONFIG.EMAIL_ADDRESS}`,
    handleOrLabel: CONTACT_CONFIG.EMAIL_LABEL,
    ariaLabel: "Send an email to Sam",
    iconName: "Mail",
    directActionLabel: "Copy Direct Email",
    priorityBadge: "Proposals & RFPs",
    description: "For formal project specifications, briefs, and scopes",
  },
];
