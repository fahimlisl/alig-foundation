import dbConnect from "@/src/lib/dbConnect";
import { verifyAdminJWT } from "@/src/lib/verifyAdminJWT";
import scholarshipPermissionModel from "@/src/models/scholarship.permission.model";
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
        const { scholarshipFee, scholarshipOpen, scholarshipLastDate } = await request.json();

        if (typeof scholarshipOpen !== "boolean") {
            return Response.json(
                {
                    success: false,
                    message: "scholarshipOpen field is required and must be a boolean",
                },
                { status: 400 }
            );
        }

        const updated = await scholarshipPermissionModel.findOneAndUpdate(
            { key: "scholarship" },
            {
                $set: {
                    scholarshipOpen,
                    ...(scholarshipFee !== undefined ? { scholarshipFee } : {}),
                    ...(scholarshipLastDate !== undefined ? { scholarshipLastDate } : {}),
                },
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }
        );

        return Response.json(
            {
                success: true,
                message: "successfully updated scholarship permission",
                data: updated,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("failed to update permission model for scholarship", error);
        return Response.json(
            {
                success: false,
                message: "failed to update permission model for scholarship",
            },
            { status: 400 }
        );
    }
}