"use client";

import React, { useState } from "react";

export type TechLogoKey =
  | "python"
  | "nextjs"
  | "react"
  | "supabase"
  | "tailwind"
  | "cloudflare"
  | "twilio"
  | "threejs"
  | "docker"
  | "typescript"
  | "numpy"
  | "postgresql"
  | "telegram"
  | "gmail"
  | "github"
  | "x"
  | "instagram"
  | "linkedin";

interface LogoProps {
  className?: string;
  size?: number;
}

export function PythonIcon({ className = "w-4 h-4" }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.006 2.753h5.815v.825H3.92S0 5.787 0 11.918c0 6.13 3.42 5.922 3.42 5.922h2.04v-2.868s-.11-3.42 3.364-3.42h5.784s3.255.053 3.255-3.15V3.15S18.337 0 11.914 0zm-3.23 1.84a1.077 1.077 0 1 1 0 2.155 1.077 1.077 0 0 1 0-2.154zm3.402 22.16c6.094 0 5.714-2.656 5.714-2.656l-.006-2.753h-5.815v-.825h8.101s3.92.447 3.92-5.684c0-6.13-3.42-5.922-3.42-5.922h-2.04v2.868s.11 3.42-3.364 3.42H9.399s-3.255-.053-3.255 3.15v5.244s-.474 3.15 5.949 3.15zm3.23-1.84a1.077 1.077 0 1 1 0-2.155 1.077 1.077 0 0 1 0 2.154z" />
    </svg>
  );
}

export function NextjsIcon({ className = "w-4 h-4" }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.665 21.978C16.808 23.25 14.502 24 12 24 5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12c0 3.584-1.574 6.801-4.068 8.995l-8.685-11.238v-2.04h2.283v.846h-1.282v7.922l8.417 10.493zm-3.882-7.051l1.63 2.051v-8.261h-1.63v6.21z" />
    </svg>
  );
}

export function ReactIcon({ className = "w-4 h-4" }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <ellipse cx="12" cy="12" rx="4" ry="10" transform="rotate(0 12 12)" />
      <ellipse cx="12" cy="12" rx="4" ry="10" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="4" ry="10" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
    </svg>
  );
}

export function SupabaseIcon({ className = "w-4 h-4" }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.923.364C12.44-.22 11.53-.105 11.21.583L3.18 17.652c-.443.948.337 2.012 1.378 1.884l8.283-1.02-1.764 5.12c-.483.584.427 1.34 1.077.904l9.66-6.49c.813-.547.464-1.815-.515-1.879l-7.794-.509 2.518-14.398c.112-.643-.518-1.2-1.1-.998z" />
    </svg>
  );
}

export function TailwindIcon({ className = "w-4 h-4" }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
    </svg>
  );
}

export function CloudflareIcon({ className = "w-4 h-4" }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.397 14.288c.08-.262.12-.538.12-.822 0-1.602-1.258-2.906-2.834-2.969-.328-2.27-2.233-4.015-4.571-4.015-2.074 0-3.812 1.37-4.417 3.29-.395-.152-.822-.236-1.267-.236-1.895 0-3.432 1.572-3.432 3.51 0 .285.034.562.099.827C.863 14.496 0 15.657 0 17.027 0 18.945 1.517 20.5 3.388 20.5h14.73c1.688 0 3.058-1.405 3.058-3.137 0-1.428-.938-2.628-2.247-3.003l-.532-.072z" />
    </svg>
  );
}

export function TwilioIcon({ className = "w-4 h-4" }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="7.5" cy="7.5" r="2.5" />
      <circle cx="16.5" cy="7.5" r="2.5" />
      <circle cx="7.5" cy="16.5" r="2.5" />
      <circle cx="16.5" cy="16.5" r="2.5" />
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" fillRule="evenodd" />
    </svg>
  );
}

export function ThreejsIcon({ className = "w-4 h-4" }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

export function DockerIcon({ className = "w-4 h-4" }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.186.185.186zm0 2.715h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.186.185.186zm-2.954 0h2.118a.186.186 0 0 0 .186-.186V6.29a.185.185 0 0 0-.185-.185H8.075a.185.185 0 0 0-.185.185v1.887c0 .102.083.186.185.186zm-2.955 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.12a.186.186 0 0 0-.186.185v1.887c0 .102.084.186.186.186zm5.909 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185zm-2.954 0h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186H8.075a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185zm-2.955 0h2.119a.186.186 0 0 0 .185-.185V9.006a.185.185 0 0 0-.185-.186H5.12a.186.186 0 0 0-.186.186v1.888c0 .102.084.185.186.185zm-2.955 0h2.119a.186.186 0 0 0 .185-.185V9.006a.185.185 0 0 0-.185-.186H2.165a.186.186 0 0 0-.186.186v1.888c0 .102.083.185.186.185zM23.99 11.53c-.347-.35-1.127-.47-1.748-.31-.19.05-.38.12-.55.22-.44.27-.72.69-.87 1.17-.47-.11-.96-.15-1.46-.11-.47.04-.92.16-1.34.34-1.28.56-2.07 1.77-2.09 3.16-.01.99.36 1.94 1.04 2.65-.24.16-.49.32-.76.46-1.57.82-3.41 1.08-5.27.76-2.05-.35-3.8-1.47-5.02-3.23-.2-.29-.37-.59-.52-.91h14.88c.38 0 .69-.31.69-.69v-.46c-.01-.73-.24-1.43-.67-2.02l-.35-.39v.01z" />
    </svg>
  );
}

export function TypeScriptIcon({ className = "w-4 h-4" }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.53 0-.96.085-1.289.255-.328.17-.493.43-.493.781 0 .221.053.407.16.559.106.151.275.283.507.394.232.111.757.307 1.575.589.98.337 1.688.761 2.124 1.272.435.51.653 1.173.653 1.987 0 .69-.17 1.3-.51 1.83a3.52 3.52 0 0 1-1.442 1.258c-.62.313-1.39.47-2.308.47-.698 0-1.378-.066-2.04-.199a8.67 8.67 0 0 1-1.63-.538v-2.614c.64.407 1.295.714 1.966.921.67.208 1.32.312 1.948.312.448 0 .808-.08 1.08-.24.271-.16.407-.39.407-.69 0-.276-.088-.501-.264-.675-.176-.174-.537-.355-1.083-.543-.654-.225-1.196-.448-1.626-.67a3.487 3.487 0 0 1-1.128-.94 2.47 2.47 0 0 1-.453-1.503c0-.668.172-1.256.516-1.764a3.553 3.553 0 0 1 1.458-1.218c.628-.301 1.393-.452 2.296-.452zm-8.32 0v2.164H7.43v9.961H4.632v-9.961H1.895V9.75z" />
    </svg>
  );
}

export function TelegramIcon({ className = "w-4 h-4" }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  );
}

export function GmailIcon({ className = "w-4 h-4" }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.491l8.073-6.002C21.691 2.279 24 3.434 24 5.457z" />
    </svg>
  );
}

export function GithubIcon({ className = "w-4 h-4" }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function XIcon({ className = "w-4 h-4" }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function InstagramIcon({ className = "w-4 h-4" }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function LinkedinIcon({ className = "w-4 h-4" }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

const LOGO_MAP: Record<TechLogoKey, { label: string; icon: React.ComponentType<LogoProps>; glowColor: string }> = {
  python: { label: "Python 3.12+", icon: PythonIcon, glowColor: "#38bdf8" },
  nextjs: { label: "Next.js 16", icon: NextjsIcon, glowColor: "#ffffff" },
  react: { label: "React 19", icon: ReactIcon, glowColor: "#38bdf8" },
  supabase: { label: "Supabase RLS", icon: SupabaseIcon, glowColor: "#34d399" },
  tailwind: { label: "Tailwind CSS v4", icon: TailwindIcon, glowColor: "#38bdf8" },
  cloudflare: { label: "Cloudflare Workers", icon: CloudflareIcon, glowColor: "#f97316" },
  twilio: { label: "Twilio Telephony", icon: TwilioIcon, glowColor: "#ef4444" },
  threejs: { label: "Three.js WebGL", icon: ThreejsIcon, glowColor: "#3b82f6" },
  docker: { label: "Docker Hardened", icon: DockerIcon, glowColor: "#38bdf8" },
  typescript: { label: "TypeScript Strict", icon: TypeScriptIcon, glowColor: "#3b82f6" },
  numpy: { label: "NumPy BLAS", icon: PythonIcon, glowColor: "#60a5fa" },
  postgresql: { label: "PostgreSQL", icon: SupabaseIcon, glowColor: "#38bdf8" },
  telegram: { label: "Telegram @Samarth1306", icon: TelegramIcon, glowColor: "#38bdf8" },
  gmail: { label: "Gmail Direct", icon: GmailIcon, glowColor: "#ef4444" },
  github: { label: "GitHub @Sam-CodesAI", icon: GithubIcon, glowColor: "#ffffff" },
  x: { label: "X @Sam_CodeAI", icon: XIcon, glowColor: "#ffffff" },
  instagram: { label: "Instagram @samarth.buildss", icon: InstagramIcon, glowColor: "#ec4899" },
  linkedin: { label: "LinkedIn @sam-codesai", icon: LinkedinIcon, glowColor: "#38bdf8" },
};

export function TechBadge({
  name,
  size = "sm",
}: {
  name: string;
  size?: "xs" | "sm" | "md";
}) {
  const [hovered, setHovered] = useState(false);
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, "");

  let matchedKey: TechLogoKey | null = null;
  if (normalized.includes("python")) matchedKey = "python";
  else if (normalized.includes("next")) matchedKey = "nextjs";
  else if (normalized.includes("react")) matchedKey = "react";
  else if (normalized.includes("supabase")) matchedKey = "supabase";
  else if (normalized.includes("tailwind")) matchedKey = "tailwind";
  else if (normalized.includes("cloud")) matchedKey = "cloudflare";
  else if (normalized.includes("twilio") || normalized.includes("webrtc")) matchedKey = "twilio";
  else if (normalized.includes("three") || normalized.includes("webgl")) matchedKey = "threejs";
  else if (normalized.includes("docker")) matchedKey = "docker";
  else if (normalized.includes("type")) matchedKey = "typescript";
  else if (normalized.includes("numpy") || normalized.includes("blas")) matchedKey = "numpy";
  else if (normalized.includes("postgres")) matchedKey = "postgresql";

  const logoInfo = matchedKey ? LOGO_MAP[matchedKey] : null;
  const IconComponent = logoInfo?.icon;

  const sizeClasses = {
    xs: "text-[10px] py-0.5 px-2 gap-1",
    sm: "text-[11px] py-1 px-2.5 gap-1.5",
    md: "text-xs py-1.5 px-3 gap-2",
  }[size];

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative inline-flex items-center rounded-lg bg-[#080d1a] border border-[#1e293b] text-slate-300 transition-all font-mono select-none ${sizeClasses} ${
        hovered ? "border-blue-500/60 text-white shadow-sm shadow-blue-500/20" : "hover:border-slate-700"
      }`}
    >
      {IconComponent && (
        <span
          className="transition-transform duration-300"
          style={{
            transform: hovered ? "scale(1.15)" : "scale(1)",
            color: hovered ? (logoInfo?.glowColor || "#38bdf8") : "currentColor",
          }}
        >
          <IconComponent className={size === "xs" ? "w-3 h-3" : "w-3.5 h-3.5"} />
        </span>
      )}
      <span>{name}</span>

      {/* Micro-tooltip */}
      {hovered && logoInfo && (
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#0f172a] border border-blue-500/40 text-[9px] font-mono text-blue-300 whitespace-nowrap shadow-lg pointer-events-none z-30 animate-fade-in">
          {logoInfo.label}
        </span>
      )}
    </span>
  );
}
