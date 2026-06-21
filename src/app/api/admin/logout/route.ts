import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "logged out" }, { status: 200 });
  response.cookies.delete("adminAccessToken");
  response.cookies.delete("adminRefreshToken");
  return response;
}