import type { Metadata, Viewport } from "next";
import "./globals.css";
import NeuralField from "@/components/NeuralField";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export const metadata: Metadata = {
  title: "Sam Codes — AI Developer & Automation Builder",
  description:
    "Samarth Nimangre — student, AI developer and automation builder creating AI systems, workflows, web experiences and digital experiments.",
  keywords: [
    "Sam Codes",
    "Samarth Nimangre",
    "Samarth Nimangre Karnataka",
    "AI Developer",
    "Automation Builder",
    "AI Agents",
    "Agentic Workflows",
    "Next.js Developer India",
    "Fullstack AI Engineer",
  ],
  authors: [{ name: "Samarth Nimangre (Sam)" }],
  creator: "Samarth Nimangre",
  metadataBase: new URL("https://sam-codes.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sam-codes.vercel.app",
    title: "Sam Codes — AI Developer & Automation Builder",
    description:
      "Samarth Nimangre — student, AI developer and automation builder creating AI systems, workflows, web experiences and digital experiments.",
    siteName: "Sam Codes",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sam Codes — AI Developer & Automation Builder",
    description:
      "Samarth Nimangre — student, AI developer and automation builder creating AI systems, workflows, web experiences and digital experiments.",
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

        {/* Global Privacy Telemetry */}
        <AnalyticsTracker />

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
