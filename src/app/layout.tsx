import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import NeuralField from "@/components/NeuralField";
import AnalyticsTracker from "@/components/AnalyticsTracker";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "SAM CODES — Intelligent Digital Systems & Autonomous Workflows",
    template: "%s | SAM CODES",
  },
  description:
    "Samarth Nimangre — AI Developer & Automation Engineer. Building autonomous agent workflows, edge webhook integrations, and production web applications with zero fabrication.",
  keywords: [
    "Sam Codes",
    "Samarth Nimangre",
    "Samarth Nimangre Karnataka",
    "AI Developer",
    "Automation Builder",
    "Automation Engineer",
    "AI Agents",
    "Agentic Workflows",
    "Next.js Developer India",
    "Fullstack AI Engineer",
    "Supabase Developer",
    "WhatsApp Webhook Automation",
  ],
  authors: [{ name: "Samarth Nimangre (Sam)", url: "https://sam-codes.vercel.app" }],
  creator: "Samarth Nimangre",
  metadataBase: new URL("https://sam-codes.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sam-codes.vercel.app",
    title: "SAM CODES — Intelligent Digital Systems & Autonomous Workflows",
    description:
      "Samarth Nimangre — AI Developer & Automation Engineer. Building autonomous agent workflows, edge webhook integrations, and production web applications.",
    siteName: "SAM CODES",
  },
  twitter: {
    card: "summary_large_image",
    title: "SAM CODES — Intelligent Digital Systems & Autonomous Workflows",
    description:
      "Samarth Nimangre — AI Developer & Automation Engineer. Building autonomous agent workflows, edge webhook integrations, and production web applications.",
    creator: "@Sam_CodeAI",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#101216",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://sam-codes.vercel.app/#samarth",
      "name": "Samarth Nimangre",
      "alternateName": "Sam",
      "url": "https://sam-codes.vercel.app",
      "jobTitle": "AI Developer & Workflow Automation Engineer",
      "worksFor": {
        "@type": "Organization",
        "name": "SAM CODES",
      },
      "sameAs": [
        "https://t.me/Samarth1306",
        "https://www.instagram.com/samarth.buildss/",
        "https://www.linkedin.com/in/sam-codesai",
        "https://x.com/Sam_CodeAI",
        "https://github.com/Sam-CodesAI",
        "https://www.reddit.com/user/SamarthBuilds_/",
      ],
      "knowsAbout": [
        "Artificial Intelligence",
        "AI Agents",
        "Vector Databases",
        "Next.js",
        "React",
        "TypeScript",
        "Supabase",
        "PostgreSQL",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://sam-codes.vercel.app/#service",
      "name": "SAM CODES",
      "url": "https://sam-codes.vercel.app",
      "description": "High-velocity AI systems, vector engines, and edge telephony engineered with zero fabrication.",
      "provider": {
        "@id": "https://sam-codes.vercel.app/#samarth",
      },
      "areaServed": "Global",
      "availableChannel": {
        "@type": "ServiceChannel",
        "serviceUrl": "https://sam-codes.vercel.app/#contact",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://sam-codes.vercel.app/#website",
      "url": "https://sam-codes.vercel.app",
      "name": "SAM CODES",
      "publisher": {
        "@id": "https://sam-codes.vercel.app/#samarth",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} dark scroll-smooth max-w-full overflow-x-hidden`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="relative bg-[#101216] text-[#E8EAF0] antialiased selection:bg-[#4D7CFE]/35 selection:text-white min-h-screen max-w-full overflow-x-hidden font-sans">
        {/* Background Neural Canvas */}
        <NeuralField />

        {/* Global Privacy Telemetry */}
        <AnalyticsTracker />

        {/* Ambient Top Glow Orbs - Contained with overflow-hidden to prevent horizontal page expansion */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <div
            className="absolute top-[-15vw] left-[10vw] w-[55vw] h-[45vw] rounded-full glow-orb-cobalt blur-[130px] opacity-40"
          />
          <div
            className="absolute top-[45vh] right-[-15vw] w-[40vw] h-[40vw] rounded-full glow-orb-lime blur-[150px] opacity-20"
          />
        </div>

        {/* Main Content Hierarchy */}
        <div className="relative z-10 flex min-h-screen flex-col w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
