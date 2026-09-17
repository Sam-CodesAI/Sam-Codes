"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Server,
  Cpu,
  Lock,
  Terminal,
  Clock,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  FileCheck2,
  Layers,
  Database,
  Globe2,
  Mail,
  Send,
  Sliders,
  Check,
  Copy,
  AlertCircle
} from "lucide-react";

interface ServiceScope {
  id: string;
  name: string;
  category: string;
  summary: string;
  timeline: string;
  deliverables: string[];
  techStack: string[];
}

const SERVICE_CATALOG: ServiceScope[] = [
  {
    id: "cloud-infra",
    name: "Cloud & Sovereign Linux Infrastructure",
    category: "Infrastructure",
    summary: "Production-grade multi-region architectures with Hetzner, AWS, or OVHcloud. Automated Terraform IaC with zero-downtime rolling updates.",
    timeline: "2 to 3 weeks",
    deliverables: [
      "Terraform Infrastructure as Code (IaC) repository",
      "Hardened Linux (Debian/RHEL) host configuration",
      "Automated SSL/TLS reverse proxy & DDoS mitigation",
      "Comprehensive Disaster Recovery (DR) playbook"
    ],
    techStack: ["Terraform", "Kubernetes", "Docker", "Hetzner Cloud", "AWS", "WireGuard"]
  },
  {
    id: "systems-integration",
    name: "Enterprise Systems & API Integration",
    category: "Engineering",
    summary: "Reliable middleware connecting disparate ERPs, CRMs, and relational databases with fault-tolerant retry queues and sub-50ms query latencies.",
    timeline: "1 to 2 weeks",
    deliverables: [
      "High-throughput REST / gRPC service microservices",
      "Transactional event queue with idempotent workers",
      "Automated database migration scripts & schema validation",
      "Interactive OpenAPI / Swagger documentation portal"
    ],
    techStack: ["TypeScript", "Node.js", "PostgreSQL", "Redis", "gRPC", "Docker"]
  },
  {
    id: "security-compliance",
    name: "Security Hardening & NIS2/GDPR Compliance",
    category: "Compliance",
    summary: "Audit-ready perimeter security, automated vulnerability remediation, CIS benchmark hardening, and sovereign EU data storage policies.",
    timeline: "1 week",
    deliverables: [
      "Full infrastructure security vulnerability report",
      "CIS Benchmark automated hardening scripts",
      "EU GDPR sovereign data boundary verification",
      "Incident response & access control protocols"
    ],
    techStack: ["OpenVAS", "CIS Benchmarks", "Let's Encrypt", "Fail2Ban", "UFW/iptables"]
  },
  {
    id: "sla-operations",
    name: "24/7 Telemetry & Retained Systems Operations",
    category: "Operations",
    summary: "Proactive Prometheus/Grafana synthetic telemetry with strict 60-minute incident escalation SLAs and quarterly capacity audits.",
    timeline: "Ongoing Retainer",
    deliverables: [
      "Prometheus & Grafana centralized metrics dashboard",
      "Automated healthchecks with SMS/Telegram alerting",
      "99.95% uptime SLA with monthly availability reports",
      "Dedicated senior engineer direct channel (No Tier-1 helpdesk)"
    ],
    techStack: ["Prometheus", "Grafana", "Alertmanager", "Loki", "Vector"]
  }
];

export default function EnterpriseITDemoPage() {
  const [selectedService, setSelectedService] = useState<string>("cloud-infra");
  const [accentTheme, setAccentTheme] = useState<"emerald" | "slate" | "cyan">("emerald");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const activeService = SERVICE_CATALOG.find((s) => s.id === selectedService) || SERVICE_CATALOG[0];

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const accentColorClasses = {
    emerald: {
      badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
      activeTab: "bg-emerald-500/15 border-emerald-500/50 text-emerald-300",
      pill: "bg-emerald-400",
      borderHover: "hover:border-emerald-500/40",
      btnPrimary: "bg-emerald-500 hover:bg-emerald-400 text-black font-semibold",
      glow: "rgba(16, 185, 129, 0.12)"
    },
    slate: {
      badge: "border-slate-400/30 bg-slate-400/10 text-slate-300",
      activeTab: "bg-slate-500/20 border-slate-400/50 text-white",
      pill: "bg-slate-300",
      borderHover: "hover:border-slate-400/40",
      btnPrimary: "bg-slate-100 hover:bg-white text-slate-900 font-semibold",
      glow: "rgba(203, 213, 225, 0.1)"
    },
    cyan: {
      badge: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
      activeTab: "bg-cyan-500/15 border-cyan-500/50 text-cyan-300",
      pill: "bg-cyan-400",
      borderHover: "hover:border-cyan-500/40",
      btnPrimary: "bg-cyan-500 hover:bg-cyan-400 text-black font-semibold",
      glow: "rgba(6, 182, 212, 0.12)"
    }
  }[accentTheme];

  return (
    <div className="min-h-screen bg-[#090d16] text-[#e2e8f0] font-sans antialiased selection:bg-emerald-500/30 selection:text-white">
      {/* Proof / Client Direct Control Banner */}
      <aside aria-label="Demo notice banner" className="w-full bg-[#0d1424] border-b border-slate-800 text-xs px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-medium border border-emerald-500/30">
            LIVE PROTOTYPE
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="font-mono text-slate-300">
            Bespoke IT Presentation Webpage for Marcel (Authorized Entity)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
            <span className="text-[11px] text-slate-400 mr-1 font-mono">Accent:</span>
            <button
              onClick={() => setAccentTheme("emerald")}
              className={`w-3.5 h-3.5 rounded-full bg-emerald-400 transition-transform ${accentTheme === "emerald" ? "ring-2 ring-white scale-110" : "opacity-60"}`}
              title="Emerald Theme"
            />
            <button
              onClick={() => setAccentTheme("cyan")}
              className={`w-3.5 h-3.5 rounded-full bg-cyan-400 transition-transform ${accentTheme === "cyan" ? "ring-2 ring-white scale-110" : "opacity-60"}`}
              title="Cyan Theme"
            />
            <button
              onClick={() => setAccentTheme("slate")}
              className={`w-3.5 h-3.5 rounded-full bg-slate-200 transition-transform ${accentTheme === "slate" ? "ring-2 ring-white scale-110" : "opacity-60"}`}
              title="Monochrome Slate Theme"
            />
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] transition-colors"
          >
            {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
            {copiedLink ? "Copied" : "Share URL"}
          </button>

          <Link
            href="/"
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] transition-colors"
          >
            Portfolio
          </Link>
        </div>
      </aside>

      {/* Primary Navigation */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-sm text-slate-200">
            M
          </div>
          <div>
            <div className="font-mono text-sm tracking-tight text-white font-semibold">
              MARCEL IT SOLUTIONS
            </div>
            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${accentColorClasses.pill} animate-pulse`} />
              Authorized Business Entity (Pending Enlistment)
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 font-mono text-xs text-slate-400">
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#governance" className="hover:text-white transition-colors">Entity Governance</a>
          <a href="#scoping" className="hover:text-white transition-colors">Scope Estimator</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>

        <a
          href="#contact"
          className={`px-4 py-2 rounded text-xs font-mono transition-all ${accentColorClasses.btnPrimary}`}
        >
          Request Engagement
        </a>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="max-w-2xl">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-6 border ${accentColorClasses.badge}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>COMMERCIAL IT INFRASTRUCTURE & SYSTEMS ARCHITECTURE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15]">
              Bespoke Systems Engineering for Authorized Commercial Entities.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed">
              We design, secure, and operate high-availability cloud infrastructure, custom database integrations, and European regulatory-compliant systems. No generic templates—pure, custom-engineered IT reliability.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#services"
                className={`px-5 py-3 rounded text-sm font-mono flex items-center gap-2 transition-all ${accentColorClasses.btnPrimary}`}
              >
                Inspect Practice Areas
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#governance"
                className="px-5 py-3 rounded text-sm font-mono bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-all"
              >
                Verify Compliance Specs
              </a>
            </div>
          </div>

          {/* Real-time Telemetry & Entity Card */}
          <div className="w-full lg:w-[420px] bg-[#0c1220] border border-slate-800 rounded-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                SYSTEM STATUS
              </span>
              <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ALL NODES HEALTHY
              </span>
            </div>

            <div className="py-5 space-y-3.5 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Infrastructure Availability:</span>
                <span className="text-white font-medium">99.98% (Trailing 12 Mo.)</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Data Sovereignty:</span>
                <span className="text-white font-medium">EU Sovereign (DE/FR/NL)</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Mean Incident Escalation:</span>
                <span className="text-emerald-400 font-medium">&lt; 35 Minutes</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Entity Legal Status:</span>
                <span className="text-slate-200 font-medium">Authorized Commercial Entity</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>B2B Reverse-Charge VAT:</span>
                <span className="text-slate-200 font-medium">Supported (EU Compliant)</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Direct Senior Engineer Access</span>
              <span className="text-slate-300">Signed Mutual NDA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Verification / Trust Indicators */}
      <section id="governance" className="border-y border-slate-800 bg-[#080d18] py-8">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="font-mono text-xs font-semibold text-white">ISO 27001 Alignment</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Strict access control & audit trails</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
              <Globe2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="font-mono text-xs font-semibold text-white">EU Data Sovereignty</div>
              <div className="text-[11px] text-slate-400 mt-0.5">100% GDPR compliant isolation</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="font-mono text-xs font-semibold text-white">Guaranteed SLAs</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Contractual response benchmarks</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
              <FileCheck2 className="w-4 h-4 text-slate-300" />
            </div>
            <div>
              <div className="font-mono text-xs font-semibold text-white">B2B Tax Compliance</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Official VAT invoicing ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Practice Areas (No Clutter, Clean Editorial Grid) */}
      <section id="services" className="max-w-6xl mx-auto px-6 py-16">
        <div className="max-w-xl mb-12">
          <div className="font-mono text-xs text-slate-400 tracking-wider uppercase mb-2">
            PRACTICE AREAS
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Specialized IT Capabilities for Growing Enterprises.
          </h2>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Every engagement delivers structured, auditable source code, clear documentation, and direct systems ownership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICE_CATALOG.map((svc) => {
            const isSelected = svc.id === selectedService;
            return (
              <div
                key={svc.id}
                onClick={() => setSelectedService(svc.id)}
                className={`cursor-pointer rounded-lg border p-6 transition-all ${
                  isSelected
                    ? "bg-[#0d1527] border-slate-600 shadow-lg ring-1 ring-slate-500"
                    : "bg-[#0b101c] border-slate-800/90 hover:border-slate-700 hover:bg-[#0d1424]"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {svc.category}
                  </span>
                  <span className="font-mono text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {svc.timeline}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {svc.name}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {svc.summary}
                </p>

                <div className="pt-4 border-t border-slate-800/80">
                  <div className="font-mono text-[11px] text-slate-400 mb-2 font-medium">Key Deliverables:</div>
                  <ul className="space-y-1.5">
                    {svc.deliverables.slice(0, 3).map((deliv, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{deliv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/60 flex flex-wrap gap-1.5">
                  {svc.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Scope & Deliverables Inspector */}
      <section id="scoping" className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-[#0b1120] border border-slate-800 rounded-lg p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-1">
                INTERACTIVE SCOPE EXPLORER
              </div>
              <h3 className="text-xl font-bold text-white">
                Inspect Deliverables for: <span className="text-emerald-400">{activeService.name}</span>
              </h3>
            </div>
            <span className="font-mono text-xs px-3 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 self-start sm:self-auto">
              Estimated Duration: {activeService.timeline}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="font-mono text-xs text-slate-400">Formal Engagement Deliverables:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeService.deliverables.map((item, idx) => (
                  <div key={idx} className="p-3 rounded bg-slate-900/90 border border-slate-800 flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-200">{item}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded bg-slate-900/50 border border-slate-800 mt-4 text-xs text-slate-300 leading-relaxed">
                <strong className="text-white font-medium">Bespoke Handoff Guarantee:</strong> All repositories, configurations, secrets management keys, and architecture documentation belong 100% to your entity upon project signoff. Zero vendor lock-in.
              </div>
            </div>

            <div className="bg-[#0e1628] border border-slate-800 rounded p-5 flex flex-col justify-between">
              <div>
                <div className="font-mono text-xs text-slate-400 mb-2">ENGAGEMENT SPECIFICATION</div>
                <div className="text-sm font-semibold text-white mb-2">Fixed-Price or Retained Model</div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Transparent milestone billing in EUR with compliant reverse-charge B2B invoices.
                </p>
                <div className="font-mono text-[11px] text-slate-400 space-y-1.5 pb-4 border-b border-slate-800">
                  <div>✓ Mutual NDA Prior to Repo Access</div>
                  <div>✓ Direct Git Remote Handoff</div>
                  <div>✓ 30-Day Post-Launch Warranty</div>
                </div>
              </div>

              <a
                href="#contact"
                className={`mt-4 w-full py-2.5 rounded text-xs font-mono text-center block transition-all ${accentColorClasses.btnPrimary}`}
              >
                Inquire for this Scope
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Inquiry & Engagement Form */}
      <section id="contact" className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-2">
              START A CONVERSATION
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Initiate an IT Consultation or System Assessment.
            </h2>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              Whether you require a one-off infrastructure audit, cloud migration, or ongoing SLA support for your authorized business entity, submit your specifications below for a prompt, technical response.
            </p>

            <div className="mt-8 space-y-4 font-mono text-xs text-slate-400">
              <div className="flex items-center gap-3 p-3 rounded bg-slate-900/60 border border-slate-800">
                <Mail className="w-4 h-4 text-slate-300" />
                <span>Direct Entity Email: contact@marcel-it.eu (Configurable)</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded bg-slate-900/60 border border-slate-800">
                <FileCheck2 className="w-4 h-4 text-slate-300" />
                <span>Commercial Registry: Pending Official Entity Enlistment</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded bg-slate-900/60 border border-slate-800">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Standard Inquiry Response Time: &lt; 24 Hours</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0b101d] border border-slate-800 rounded-lg p-6 sm:p-8 shadow-xl">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Inquiry Submitted Successfully</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Thank you. In production, this form will forward directly to your corporate inbox or CRM.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Your Name / Organization
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Johannes Müller / Apex Logistics GmbH"
                    className="w-full px-3.5 py-2.5 rounded bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Business Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="johannes@apex-logistics.de"
                    className="w-full px-3.5 py-2.5 rounded bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Selected Practice Area
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 font-sans"
                  >
                    {SERVICE_CATALOG.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.timeline})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Project Requirements / Infrastructure Scope
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Briefly describe your environment (e.g. current hosting provider, required SLAs, target launch timeline)..."
                    className="w-full px-3.5 py-2.5 rounded bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 font-sans text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 rounded text-xs font-mono flex items-center justify-center gap-2 transition-all ${accentColorClasses.btnPrimary}`}
                >
                  <Send className="w-3.5 h-3.5" />
                  Transmit Project Inquiry
                </button>

                <p className="text-[11px] text-slate-500 text-center font-mono">
                  All communications protected under standard confidentiality protocols.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070b14] py-8 font-mono text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} Marcel IT Solutions. Authorized Commercial Entity.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400">Legal Notice (Impressum)</span>
            <span className="hover:text-slate-400">Privacy Policy (DSGVO)</span>
            <span className="text-slate-400">Custom Built by Samarth</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
