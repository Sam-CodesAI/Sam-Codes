import React from "react";
import CinematicIntro from "@/components/CinematicIntro";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import CapabilitiesSection from "@/components/CapabilitiesSection";
import LabSection from "@/components/LabSection";
import ProcessSection from "@/components/ProcessSection";
import AboutSection from "@/components/AboutSection";
import ExploringSection from "@/components/ExploringSection";
import MilestonesSection from "@/components/MilestonesSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AskSamAssistant from "@/components/AskSamAssistant";
import EasterEggs from "@/components/EasterEggs";

export default function HomePage() {
  return (
    <>
      {/* Opening sequence for first-time session arrivals */}
      <CinematicIntro />

      {/* Floating navigation header */}
      <Navbar />

      {/* Core Portfolio Page Flow */}
      <main className="flex-1 flex flex-col">
        <Hero />
        <Statement />
        <CapabilitiesSection />
        <LabSection />
        <ProcessSection />
        <AboutSection />
        <ExploringSection />
        <MilestonesSection />
        <ServicesSection />
        <ContactSection />
      </main>

      {/* Footer credits and links */}
      <Footer />

      {/* Floating Interactive Assistant */}
      <AskSamAssistant />

      {/* Developer Telemetry HUD */}
      <EasterEggs />
    </>
  );
}
