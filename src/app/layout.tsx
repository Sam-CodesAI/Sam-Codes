import type { Metadata, Viewport } from "next";
import "./globals.css";
import NeuralField from "@/components/NeuralField";

export const metadata: Metadata = {
  title: "SAM CODES | Samarth Nimangre — AI Developer & Systems Builder",
  description:
    "Building intelligent digital experiences. AI applications, agentic workflows, business automations, and modern web engineering by Samarth Nimangre (Sam), Karnataka, India.",
  keywords: [
    "Sam Codes",
    "Samarth Nimangre",
    "AI Developer",
    "Automation Builder",
    "AI Agents",
    "Agentic Workflows",
    "Next.js Developer India",
    "Fullstack AI Engineer",
  ],
  authors: [{ name: "Samarth Nimangre (Sam)" }],
  creator: "Samarth Nimangre",
  metadataBase: new URL("https://samcodes.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://samcodes.dev",
    title: "SAM CODES | Samarth Nimangre — AI Developer & Systems Builder",
    description:
      "Turning ambitious ideas into functional digital systems through AI applications, agentic workflows, business automations, and modern web engineering.",
    siteName: "SAM CODES",
  },
  twitter: {
    card: "summary_large_image",
    title: "SAM CODES | Samarth Nimangre",
    description:
      "Building intelligent digital experiences through AI applications, automations, and modern web engineering.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#06080f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="relative bg-[#06080f] text-slate-100 antialiased selection:bg-sky-500/20 selection:text-white min-h-screen">
        {/* Background Neural Canvas */}
        <NeuralField />

        {/* Ambient Top Glow Orbs */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-[-15vw] left-[15vw] w-[50vw] h-[40vw] rounded-full glow-orb-cyan blur-[120px] opacity-40 z-0"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-[30vh] right-[-10vw] w-[45vw] h-[45vw] rounded-full glow-orb-purple blur-[140px] opacity-35 z-0"
        />

        {/* Main Content Hierarchy */}
        <div className="relative z-10 flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
