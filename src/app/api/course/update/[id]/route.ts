import courseModel from "@/src/models/course.model";
import dbConnect from "@/src/lib/dbConnect";
import { verifyAdminJWT } from "@/src/lib/verifyAdminJWT";
import { NextRequest, NextResponse } from "next/server";

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
        const { id } = await params;
        const { title, description, basePrice, finalPrice, duration, overview } = await request.json();

        // build update object with only the fields actually provided —
        // so admin can send just one field without wiping out the others
        const updateFields: Record<string, any> = {};
        if (title !== undefined) updateFields.title = title;
        if (description !== undefined) updateFields.description = description;
        if (basePrice !== undefined) updateFields.basePrice = basePrice;
        if (finalPrice !== undefined) updateFields.finalPrice = finalPrice;
        if (duration !== undefined) updateFields.duration = duration;
        if (overview !== undefined) updateFields.overview = overview;

        if (Object.keys(updateFields).length === 0) {
            return Response.json(
                { success: false, message: "no fields provided to update" },
                { status: 400 }
            );
        }

        const updatedCourse = await courseModel.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedCourse) {
            return Response.json(
                { success: false, message: "course not found" },
                { status: 404 }
            );
        }

        return Response.json(
            { success: true, message: "course updated successfully", data: updatedCourse },
            { status: 200 }
        );
    } catch (error) {
        console.error("failed to update course", error);
        return Response.json(
            { success: false, message: "failed to update the course" },
            { status: 500 }
        );
    }
}