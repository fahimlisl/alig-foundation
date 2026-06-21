import courseModel from "@/src/models/course.model";
import dbConnect from "@/src/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminJWT } from "@/src/lib/verifyAdminJWT";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
       const admin = verifyAdminJWT(request);
 
    if (!admin) {
        return NextResponse.json(
            { success: false, message: "unauthorized — please login" },
            { status: 401 }
        );
    }
    await dbConnect();

    try {
        const { id } = await params;
        const { title } = await request.json();

        if (!title) {
            return Response.json(
                { success: false, message: "highlight title is required" },
                { status: 400 }
            );
        }

        const updatedCourse = await courseModel.findByIdAndUpdate(
            id,
            { $push: { highlights: { title } } },
            { new: true }
        );

        if (!updatedCourse) {
            return Response.json(
                { success: false, message: "course not found" },
                { status: 404 }
            );
        }

        return Response.json(
            { success: true, message: "highlight added", data: updatedCourse.highlights },
            { status: 200 }
        );
    } catch (error) {
        console.error("failed to add highlight", error);
        return Response.json(
            { success: false, message: "failed to add highlight" },
            { status: 500 }
        );
    }
}