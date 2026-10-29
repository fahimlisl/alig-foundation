import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/src/lib/dbConnect";
import scholarshipModel from "@/src/models/scholarship.model";
import { ADMIT_CARD_CONFIG } from "@/src/lib/admit-card/config";
import { allowAdmitCardLookup } from "@/src/lib/admit-card/rate-limit";
import type { AdmitCardData } from "@/src/lib/admit-card/types";
import scholarshipPermissionModel from "@/src/models/scholarship.permission.model";

export const runtime = "nodejs"; 
export const dynamic = "force-dynamic";

const NO_STORE = {
  "Cache-Control": "private, no-store, max-age=0",
  Pragma: "no-cache",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

function send(body: object, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type Lookup = { kind: "email" | "phone"; value: string };
function parseIdentifier(body: unknown): Lookup | null {
  if (!body || typeof body !== "object") return null;
  const raw = (body as Record<string, unknown>).identifier;
  if (typeof raw !== "string" || raw.length > 254) return null;
  const trimmed = raw.trim();
  if (trimmed.includes("@")) {
    const email = trimmed.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
    return { kind: "email", value: email };
  }
  const digits = trimmed.replace(/[\s()+-]/g, "");
  const phone = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  if (!/^[6-9]\d{9}$/.test(phone)) return null;
  return { kind: "phone", value: phone };
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const originHost = origin ? (() => { try { return new URL(origin).host; } catch { return ""; } })() : null;
  if (originHost !== null && originHost !== request.headers.get("host")) {
    return send({ message: "Request not allowed." }, 403);
  }
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return send({ message: "Expected JSON." }, 415);
  }
  if (Number(request.headers.get("content-length") || 0) > 1024) {
    return send({ message: "Request too large." }, 413);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return send({ message: "Invalid JSON request." }, 400);
  }
  const lookup = parseIdentifier(body);
  if (!lookup) {
    return send({ message: "Enter a valid email address or Indian mobile number." }, 400);
  }

  try {
    await dbConnect();
    const permission = await scholarshipPermissionModel
      .findOne({ key: "scholarship" })
      .select("issueAdmitCard")
      .lean();

    if (permission?.issueAdmitCard !== true) {
      return send(
        {
          message:
            "Admit card downloads are not available yet.",
        },
        403
      );
    }
    const ip = request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const allowed = await allowAdmitCardLookup(ip, `${lookup.kind}:${lookup.value}`);
    if (!allowed) {
      return NextResponse.json(
        { message: "Too many requests. Please try again in 15 minutes." },
        { status: 429, headers: { ...NO_STORE, "Retry-After": "900" } }
      );
    }

    const query = lookup.kind === "email"
      ? { email: { $regex: `^${escapeRegex(lookup.value)}$`, $options: "i" } }
      : { phone: { $in: [lookup.value, `91${lookup.value}`, `+91${lookup.value}`] } };

    const matches = await scholarshipModel
      .find(query)
      .select(
        "full_name gurdianName registration_no roll_no course mode avatar"
      )
      .limit(2)
      .lean();

    if (matches.length !== 1) {
      return send({ message: "No unique admit card was found for these details. Contact ALIG Foundation for assistance." }, 404);
    }
    const student = matches[0];
    if (!student.avatar?.trim()) {
      return send(
        {
          message:
            "Student photograph is missing. Please contact ALIG Foundation.",
        },
        409
      );
    }


    if (!student.registration_no || !student.roll_no || !student.full_name) {
      return send({ message: "Application details are incomplete. Contact ALIG Foundation." }, 409);
    }
    if (
      student.mode === "offline" &&
      !ADMIT_CARD_CONFIG.offlineTestCentre.trim()
    ) {
      return send(
        {
          message: "Offline test centre is not configured yet.",
        },
        503
      );
    }

    const payload: AdmitCardData = {
      candidateName: student.full_name,
      guardianName: student.gurdianName || "N/A",
      registrationNo: student.registration_no,
      rollNo: student.roll_no,
      course: student.course || "N/A",
      mode: student.mode === "online" ? "online" : "offline",
      testCentre:
        student.mode === "offline"
          ? ADMIT_CARD_CONFIG.offlineTestCentre
          : "",
      title: ADMIT_CARD_CONFIG.heading,
      examDate: ADMIT_CARD_CONFIG.examDate,
      examTime: student.mode === "offline" ?  "11:00 AM To 12:30 PM" : "9:00 PM To 10:20 PM",
      foundationEmail: ADMIT_CARD_CONFIG.foundationEmail,
      contactNumbers: ADMIT_CARD_CONFIG.contactNumbers,
      instructions: student.mode === "online" ? [...ADMIT_CARD_CONFIG.onlineInstructions] : [...ADMIT_CARD_CONFIG.offlineInstructions],
      avatarUrl: student?.avatar,
    };
    return send(payload);
  } catch {
    console.error("Admit card lookup failed (internal error)");
    return send({ message: "Admit card service is temporarily unavailable." }, 500);
  }
}
