import courseModel from "@/src/models/course.model";
import dbConnect from "@/src/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminJWT } from "@/src/lib/verifyAdminJWT";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
       const admin = verifyAdminJWT(request);
 
    if (!admin) {
        return NextResponse.json(
            { success: false, message: "unauthorized — please login" },
            { status: 401 }
        );
    }
    await dbConnect();

    try {
        const { id } = await params; // course id
        const { highlightId, title } = await request.json();

        if (!highlightId || !title) {
            return Response.json(
                { success: false, message: "highlightId and title are required" },
                { status: 400 }
            );
        }

        const updatedCourse = await courseModel.findOneAndUpdate(
            { _id: id, "highlights._id": highlightId },
            { $set: { "highlights.$.title": title } },
            { new: true }
        );

        if (!updatedCourse) {
            return Response.json(
                { success: false, message: "course or highlight not found" },
                { status: 404 }
            );
        }

        return Response.json(
            { success: true, message: "highlight updated", data: updatedCourse.highlights },
            { status: 200 }
        );
    } catch (error) {
        console.error("failed to update highlight", error);
        return Response.json(
            { success: false, message: "failed to update highlight" },
            { status: 500 }
        );
    }
}