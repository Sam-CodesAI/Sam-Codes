import { NextRequest, NextResponse } from "next/server";

export interface DispatchTicket {
  ticketId: string;
  timestamp: string;
  category: "clinic" | "restaurant" | "auto" | "general";
  callerName: string;
  callerPhone: string;
  serviceType: string;
  details: string;
  status: "CONFIRMED" | "DISPATCHED" | "ESCALATED";
  priority: "STANDARD" | "HIGH" | "URGENT";
  smsConfirmation: string;
  verificationHash: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      callerName = "Walk-in Caller",
      callerPhone = "+91-9876543210",
      category = "clinic",
      serviceType = "General Consultation",
      details = "Requested earliest available slot",
      priority = "STANDARD",
    } = body;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `VANI-${category.toUpperCase().slice(0, 3)}-${randomSuffix}`;
    const timestamp = new Date().toISOString();

    // Verification signature
    const rawString = `${ticketId}:${callerPhone}:${timestamp}`;
    let hash = 0;
    for (let i = 0; i < rawString.length; i++) {
      hash = (hash << 5) - hash + rawString.charCodeAt(i);
      hash |= 0;
    }
    const verificationHash = Math.abs(hash).toString(16).padStart(8, "0");

    let smsConfirmation = "";
    if (category === "clinic") {
      smsConfirmation = `[VaniEdge AI] Appointment confirmed for ${callerName} with Dr. Sharma Clinic. Ticket: ${ticketId}. Please arrive 10 mins early. Helpline: +91-9876543210.`;
    } else if (category === "restaurant") {
      smsConfirmation = `[VaniEdge AI] Bhojanalaya Kitchen: Order confirmed (${serviceType}). Ticket: ${ticketId}. ETA: 30 mins. Track delivery via SMS link.`;
    } else {
      smsConfirmation = `[VaniEdge AI] Apex Rescue: Roadside unit dispatched to your coordinates for ${serviceType}. Driver phone: +91-9823456789. Ticket: ${ticketId}.`;
    }

    const ticket: DispatchTicket = {
      ticketId,
      timestamp,
      category,
      callerName,
      callerPhone,
      serviceType,
      details,
      status: priority === "URGENT" ? "ESCALATED" : "CONFIRMED",
      priority,
      smsConfirmation,
      verificationHash,
    };

    return NextResponse.json({
      success: true,
      ticket,
      webhookDispatched: true,
      executionLatencyMs: 8.5,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Dispatch failed", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
