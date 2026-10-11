import "server-only";
import { createHmac } from "node:crypto";
import LookupLimitModel from "@/src/models/admit-card-lookup-limit.model";

const WINDOW_MS = 15 * 60 * 1000;

function digest(kind: string, value: string): string {
  const secret = process.env.ADMIT_RATE_LIMIT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("Set ADMIT_RATE_LIMIT_SECRET (at least 32 characters) before enabling admit card lookup.");
  }
  return createHmac("sha256", secret).update(`${kind}:${value}`).digest("hex");
}

async function countRequest(kind: string, value: string, maxRequests: number): Promise<boolean> {
  const now = Date.now();
  const bucket = Math.floor(now / WINDOW_MS);
  const key = `${kind}:${bucket}:${digest(kind, value)}`;
  try {
    const record = await LookupLimitModel.findOneAndUpdate(
      { key },
      {
        $inc: { count: 1 },
        $setOnInsert: { expiresAt: new Date((bucket + 1) * WINDOW_MS + 60_000) },
      },
      { upsert: true, new: true, lean: true }
    );
    return Boolean(record && record.count <= maxRequests);
  } catch {
    // Fail closed on rate-limit database/index errors, including parallel upsert collisions.
    return false;
  }
}

/**
 * Rate limits work across multiple Next.js workers because MongoDB stores the counters.
 * Trust X-Real-IP only if your reverse proxy overwrites it (never forwards client input).
 */
export async function allowAdmitCardLookup(ip: string, identifier: string): Promise<boolean> {
  const ipAllowed = await countRequest("ip", ip, 10);
  if (!ipAllowed) return false;
  return countRequest("identifier", identifier, 5);
}
