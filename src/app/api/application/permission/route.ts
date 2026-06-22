import dbConnect from "@/src/lib/dbConnect";
import { verifyAdminJWT } from "@/src/lib/verifyAdminJWT";
import applicationPermissionModel from "@/src/models/application.permission.model";
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
        const { admissionFee, admissionOpen } = await request.json();

        if (typeof admissionOpen !== "boolean") {
            return Response.json(
                {
                    success: false,
                    message: "admissionOpen field is required and must be a boolean",
                },
                { status: 400 }
            );
        }

        const updated = await applicationPermissionModel.findOneAndUpdate(
            { key: "global" },
            {
                $set: {
                    admissionOpen,
                    ...(admissionFee !== undefined ? { admissionFee } : {}),
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
                message: "successfully updated application permission",
                data: updated,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("failed to update permission model for application", error);
        return Response.json(
            {
                success: false,
                message: "failed to update permission model for application",
            },
            { status: 400 }
        );
    }
}