import courseModel from "@/src/models/course.model";
import dbConnect from "@/src/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminJWT } from "@/src/lib/verifyAdminJWT";

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
        const { id } = params;

        const deletedCourse = await courseModel.findByIdAndDelete(id);

        if (!deletedCourse) {
            return Response.json(
                { success: false, message: "course not found" },
                { status: 404 }
            );
        }

        return Response.json(
            { success: true, message: `successfully deleted course "${deletedCourse.title}"` },
            { status: 200 }
        );
    } catch (error) {
        console.error("failed to delete course", error);
        return Response.json(
            { success: false, message: "failed to delete the course" },
            { status: 500 }
        );
    }
}