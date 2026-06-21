import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

type AdminTokenPayload = {
    _id: string;
    email: string;
    role: string;
};

/**
 * Verifies the adminAccessToken cookie on an incoming request.
 * Returns the decoded payload if valid, or null if missing/invalid/expired.
 * Does NOT throw — callers check for null and return their own 401 response.
 */
export function verifyAdminJWT(request: NextRequest): AdminTokenPayload | null {
    const token = request.cookies.get("adminAccessToken")?.value;

    if (!token) return null;

    try {
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!
        ) as AdminTokenPayload;

        return decoded;
    } catch (err) {
        // covers both expired tokens and tampered/invalid signatures
        return null;
    }
}