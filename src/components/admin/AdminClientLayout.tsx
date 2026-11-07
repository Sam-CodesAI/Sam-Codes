"use client";

import React from "react";
import { ToastProvider } from "@/components/admin/ToastProvider";

export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ToastProvider>{children}</ToastProvider>;
}
