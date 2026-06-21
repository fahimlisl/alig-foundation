import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import adminModel from "@/src/models/admin.model";
import dbConnect from "@/src/lib/dbConnect";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const incomingRefreshToken = request.headers
            .get("cookie")
            ?.split("; ")
            .find((c) => c.startsWith("adminRefreshToken="))
            ?.split("=")[1];

        if (!incomingRefreshToken) {
            return NextResponse.json(
                { success: false, message: "no refresh token provided" },
                { status: 401 }
            );
        }

        let decoded: { _id: string };
        try {
            decoded = jwt.verify(
                incomingRefreshToken,
                process.env.REFRESH_TOKEN_SECRET!
            ) as { _id: string };
        } catch (err) {
            return NextResponse.json(
                { success: false, message: "refresh token expired or invalid, please login again" },
                { status: 401 }
            );
        }

        const admin = await adminModel.findById(decoded._id);

        if (!admin) {
            return NextResponse.json(
                { success: false, message: "admin not found" },
                { status: 404 }
            );
        }

        if (incomingRefreshToken !== admin.adminRefreshToken) {
            return NextResponse.json(
                { success: false, message: "refresh token is invalid or has been used, please login again" },
                { status: 401 }
            );
        }
        const newAccessToken = jwt.sign(
            { _id: admin._id, email: admin.email, role: "admin" },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "15m" }
        );

        const newRefreshToken = jwt.sign(
            { _id: admin._id },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "14d" }
        );

        admin.adminRefreshToken = newRefreshToken;
        await admin.save();

        const response = NextResponse.json(
            { success: true, message: "token refreshed successfully" },
            { status: 200 }
        );

        response.cookies.set("adminAccessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 15 * 60,
        });

        response.cookies.set("adminRefreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 14 * 24 * 60 * 60,
        });

        return response;
    } catch (error) {
        console.error("error while refreshing admin token", error);
        return NextResponse.json(
            { success: false, message: "failed to refresh token" },
            { status: 500 }
        );
    }
}