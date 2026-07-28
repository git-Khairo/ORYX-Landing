import { NextResponse } from "next/server";
import { JOURNEYS, type ServiceId } from "@/lib/content";

/**
 * Receives an operational request.
 *
 * Server side validation mirrors the wizard: the client is a
 * convenience, not the gate. Replace the delivery step with the real
 * destination (CRM, inbox or ticket queue) when it is decided; the
 * contract of this endpoint does not need to change.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface Payload {
  service?: string;
  answers?: Record<string, unknown>;
  details?: Record<string, unknown>;
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "We could not read that request." },
      { status: 400 },
    );
  }

  const service = body.service as ServiceId | undefined;
  if (!service || !(service in JOURNEYS)) {
    return NextResponse.json(
      { ok: false, error: "Choose a service before sending." },
      { status: 400 },
    );
  }

  const details = (body.details ?? {}) as Record<string, string>;
  const errors: Record<string, string> = {};

  if (!details.name?.trim()) errors.name = "We need a name to reply to.";
  if (!details.company?.trim()) errors.company = "Tell us which company this is for.";

  const wantsPhone = details.contactPreference === "phone";
  if (wantsPhone) {
    if (!details.phone?.trim()) errors.phone = "Add a number we can call.";
  } else if (!EMAIL.test(details.email ?? "")) {
    errors.email = "That email address does not look complete.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const reference = `ORX-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  // Delivery target to be connected. Logged for now so nothing is lost.
  console.info("[oryx] request received", {
    reference,
    service,
    answers: body.answers,
    company: details.company,
  });

  return NextResponse.json({ ok: true, reference });
}
