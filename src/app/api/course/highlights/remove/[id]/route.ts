import courseModel from "@/src/models/course.model";
import dbConnect from "@/src/lib/dbConnect";
import { verifyAdminJWT } from "@/src/lib/verifyAdminJWT";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
        const { highlightId } = await request.json(); // which highlight to remove

        if (!highlightId) {
            return Response.json(
                { success: false, message: "highlightId is required" },
                { status: 400 }
            );
        }

        const updatedCourse = await courseModel.findByIdAndUpdate(
            id,
            { $pull: { highlights: { _id: highlightId } } },
            { new: true }
        );

        if (!updatedCourse) {
            return Response.json(
                { success: false, message: "course not found" },
                { status: 404 }
            );
        }

        return Response.json(
            { success: true, message: "highlight removed", data: updatedCourse.highlights },
            { status: 200 }
        );
    } catch (error) {
        console.error("failed to remove highlight", error);
        return Response.json(
            { success: false, message: "failed to remove highlight" },
            { status: 500 }
        );
    }
}