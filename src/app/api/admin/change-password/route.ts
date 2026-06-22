import adminModel from "@/src/models/admin.model";
import dbConnect from "@/src/lib/dbConnect";
import { verifyAdminJWT } from "@/src/lib/verifyAdminJWT";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const admin = verifyAdminJWT(request);

    if (!admin) {
        return Response.json(
            { success: false, message: "unauthorized — please login" },
            { status: 401 }
        );
    }

    await dbConnect();

    try {
        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return Response.json(
                { success: false, message: "current password and new password are required" },
                { status: 400 }
            );
        }

        if (newPassword.length < 8) {
            return Response.json(
                { success: false, message: "new password must be at least 8 characters long" },
                { status: 400 }
            );
        }

        if (currentPassword === newPassword) {
            return Response.json(
                { success: false, message: "new password must be different from current password" },
                { status: 400 }
            );
        }

        const adminDoc = await adminModel.findById(admin._id);

        if (!adminDoc) {
            return Response.json(
                { success: false, message: "admin not found" },
                { status: 404 }
            );
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, adminDoc.password);

        if (!isPasswordValid) {
            return Response.json(
                { success: false, message: "current password is incorrect" },
                { status: 401 }
            );
        }

        // pre-save hook on the model hashes this automatically since it's a modified path
        adminDoc.password = newPassword;
        await adminDoc.save();

        return Response.json(
            {
                success: true,
                message: "password changed successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("failed to change admin password", error);
        return Response.json(
            { success: false, message: "failed to change password" },
            { status: 500 }
        );
    }
}