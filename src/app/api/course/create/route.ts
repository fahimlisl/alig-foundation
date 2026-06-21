import courseModel from "@/src/models/course.model";
import dbConnect from "@/src/lib/dbConnect";
import { verifyAdminJWT } from "@/src/lib/verifyAdminJWT";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest) {

    const admin = verifyAdminJWT(request);
 
    if (!admin) {
        return NextResponse.json(
            { success: false, message: "unauthorized — please login" },
            { status: 401 }
        );
    }


    await dbConnect()
    try {
        const { title,description,basePrice,finalPrice,duration,overview } = await request.json();
        if([title,description,finalPrice,duration].some((t) => !t && t !== 0)){
            return Response.json(
                { success: false, message: "every field is must required" },
                { status: 400 }
            );
        }
        
        const course = await courseModel.create({
            title,
            description,
            basePrice,
            finalPrice,
            duration,
            overview
        })

        return Response.json(
            {
                success:true,
                message:"successfully created a course"
            },
            {
                status:201
            }
        )
    } catch (error) {
        console.error("failed to create course",error);
        return Response.json(
            {
                success:false,
                message:"faield to create the course"
            },
            {
                status:500
            }
        )
    }
}
