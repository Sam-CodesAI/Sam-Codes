import React from "react";
import type { Metadata } from "next";
import AdminClientLayout from "@/components/admin/AdminClientLayout";

export const metadata: Metadata = {
  title: "SAM CODES // COMMAND CENTER",
  description: "Administrative control plane for Samarth Nimangre",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#06080f] text-slate-100 font-sans selection:bg-sky-500/20 selection:text-white">
      <AdminClientLayout>{children}</AdminClientLayout>
    </div>
  );
}
