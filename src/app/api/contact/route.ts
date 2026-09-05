import { NextRequest, NextResponse } from "next/server";
import { createInquiry } from "@/lib/data-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Honeypot anti-spam check
    if (body.website_trap || body._gotcha) {
      return NextResponse.json({ success: true, message: "Inquiry received." });
    }

    const { name, email, contactMethod, serviceRequested, message } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Please provide a valid name." }, { status: 400 });
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json({ error: "Please provide a descriptive message." }, { status: 400 });
    }

    const savedInquiry = await createInquiry({
      name: name.trim(),
      email: email?.trim(),
      contactMethod: contactMethod?.trim() || email?.trim() || "Not specified",
      serviceRequested: serviceRequested?.trim() || "General Inquiry",
      message: message.trim(),
    });

    return NextResponse.json({
      success: true,
      message: "Thank you, Sam has received your message and will review it shortly.",
      inquiryId: savedInquiry.id,
    });
  } catch (err) {
    console.error("Error submitting contact inquiry:", err);
    return NextResponse.json({ error: "Failed to submit inquiry. Please reach out directly." }, { status: 500 });
  }
}
