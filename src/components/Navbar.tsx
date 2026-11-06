"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Sparkles, Menu, X } from "lucide-react";
import { soundFx } from "@/utils/sound";

const NAV_LINKS = [
  { label: "The Lab", href: "/#lab" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Reach Me", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSoundToggle = () => {
    const isEnabled = soundFx.toggle();
    setSoundEnabled(isEnabled);
  };

  const openAskSam = () => {
    soundFx.playChime(600, 0.08);
    window.dispatchEvent(new CustomEvent("open-ask-sam"));
  };

  const handleLinkClick = () => {
    soundFx.playHover();
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex justify-center px-4 py-3 sm:py-4 transition-all duration-300">
      <nav
        aria-label="Main Navigation"
        className={`w-full max-w-6xl flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-full transition-all duration-300 ${
          scrolled
            ? "bg-[#080d1a]/90 backdrop-blur-xl border border-[#1e293b] shadow-2xl shadow-black/60"
            : "bg-[#080d1a]/50 backdrop-blur-md border border-[#1e293b]/60"
        }`}
      >
        {/* Brand Name */}
        <a
          href="#"
          onClick={() => soundFx.playChime(440, 0.05)}
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-md"
        >
          <span className="w-2 h-2 rounded-full bg-[#ccff00] shadow-[0_0_8px_#ccff00] group-hover:scale-125 transition-transform" />
          <span className="font-mono font-black tracking-wider text-sm sm:text-base text-white group-hover:text-blue-300 transition-colors">
            SAM CODES
          </span>
          <span className="hidden md:inline text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-600/15 border border-blue-500/30 text-blue-400 font-bold">
            v2.0
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onMouseEnter={() => soundFx.playHover()}
              className="text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white transition-colors relative py-1 focus:outline-none focus-visible:text-sky-400"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio FX Toggle */}
          <button
            type="button"
            onClick={handleSoundToggle}
            aria-label={soundEnabled ? "Mute interactive audio" : "Enable interactive audio"}
            title={soundEnabled ? "Audio FX Active (Click to mute)" : "Enable subtle Audio FX"}
            className={`p-2 rounded-full border transition-all text-xs flex items-center justify-center cursor-pointer min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] ${
              soundEnabled
                ? "bg-blue-600/15 border-blue-500/40 text-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.3)]"
                : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-slate-200"
            }`}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {/* Ask Sam AI Assistant Trigger */}
          <button
            type="button"
            onClick={openAskSam}
            aria-label="Open Ask Sam interactive assistant"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-300 hover:text-white hover:border-blue-400 hover:bg-blue-600/25 transition-all text-xs font-mono cursor-pointer shadow-sm min-h-[40px] sm:min-h-[44px]"
          >
            <Sparkles size={13} className="text-[#ccff00] animate-pulse" />
            <span>Ask Sam</span>
          </button>

          {/* Work With Me CTA */}
          <a
            href="/contact"
            onClick={() => soundFx.playChime(520, 0.08)}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-all text-xs font-semibold tracking-wide shadow-md shadow-blue-600/25 cursor-pointer min-h-[44px]"
          >
            Work with me
          </a>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => {
              soundFx.playHover();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Toggle mobile menu"
            className="p-2.5 lg:hidden rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:text-white cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-4 top-20 bg-[#080d1a]/98 backdrop-blur-2xl border border-[#1e293b] rounded-2xl p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200 z-50">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="text-sm font-mono tracking-wider text-slate-300 hover:text-blue-400 py-3 border-b border-white/[0.04] transition-colors min-h-[44px] flex items-center"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openAskSam();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-300 font-mono text-xs flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
            >
              <Sparkles size={15} className="text-[#ccff00]" />
              <span>Ask Sam Grounded Assistant</span>
            </button>
            <a
              href="/contact"
              onClick={handleLinkClick}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs text-center cursor-pointer transition-colors min-h-[48px] flex items-center justify-center shadow-lg shadow-blue-600/25"
            >
              Work with me directly
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
