import React from "react";
import QuantumPreloader from "@/components/preloader/QuantumPreloader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TechEcosystem from "@/components/TechEcosystem";
import LabSection from "@/components/LabSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ReachCTA from "@/components/ReachCTA";
import Footer from "@/components/Footer";
import AskSamAssistant from "@/components/AskSamAssistant";
import EasterEggs from "@/components/EasterEggs";
import { profileData } from "@/data/profile";
import { projectsData, experimentsData } from "@/data/projects";
import { assistantKnowledgeBase } from "@/data/assistantKnowledge";
import { getProfile, getAssistantKnowledge } from "@/lib/data-service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profile, knowledge] = await Promise.all([
    getProfile().catch(() => profileData),
    getAssistantKnowledge().catch(() => assistantKnowledgeBase),
  ]);

  return (
    <>
      {/* 1. SAM CODES Quantum Core System Preloader */}
      <QuantumPreloader />

      {/* 2. Floating navigation bar */}
      <Navbar />

      {/* 3. Core Portfolio Flow */}
      <main className="flex-1 flex flex-col">
        {/* Minimalist Hero with dynamic roles, founder portrait, and 3D Vector Core */}
        <Hero profile={profile} />

        {/* Tech Stack Ecosystem Bar with clickable monochrome glass logos */}
        <TechEcosystem />

        {/* The Lab: Flagship Anime Cyber-Folder Cartridges -> Anime portal warp to /projects/[slug] */}
        <LabSection
          projects={projectsData}
          experiments={experimentsData}
        />

        {/* About Me: Sticky Pinned Founder Portrait with 70% Dark Fade & Narrative Scrolling Over It */}
        <AboutSection />

        {/* Services: 2-Folder Interactive System (Freelance Library & Specialized AI) */}
        <ServicesSection />

        {/* Reach Me: Terminal CTA directing to the dedicated /contact 3D Cyber Highway */}
        <ReachCTA />
      </main>

      {/* Footer credits and quick links */}
      <Footer />

      {/* Floating Interactive Assistant */}
      <AskSamAssistant knowledge={knowledge} />

      {/* Developer Telemetry HUD */}
      <EasterEggs />
    </>
  );
}
