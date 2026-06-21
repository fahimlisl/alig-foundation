import courseModel from "@/src/models/course.model";
import dbConnect from "@/src/lib/dbConnect";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {

    await dbConnect();
    try {
        const { id } = await params;

        const course = await courseModel.findById(id);
        if (!course) {
            return Response.json(
                { success: false, message: "course not found" },
                { status: 404 }
            );
        }

        return Response.json(
            { success: true, message: "course fetched successfully", data: course },
            { status: 200 }
        );
    } catch (error) {
        console.error("failed to fetch course", error);
        return Response.json(
            { success: false, message: "failed to fetch the course" },
            { status: 500 }
        );
    }
}