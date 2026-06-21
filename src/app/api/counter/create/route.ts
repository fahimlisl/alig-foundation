import dbConnect from "@/src/lib/dbConnect";
import { verifyAdminJWT } from "@/src/lib/verifyAdminJWT";
import counterModel from "@/src/models/counter.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {

    const admin = verifyAdminJWT(request);
 
    if (!admin) {
        return NextResponse.json(
            { success: false, message: "unauthorized — please login" },
            { status: 401 }
        );
    }


    await dbConnect();

    try {
        const {course,courseSymbol,lastNumber} = await request.json()
        if([course,courseSymbol,lastNumber].some((t) => !t && t !== 0)){
            return Response.json(
                {
                    success:false,
                    message:"all fields are required"
                },
                {
                    status:400
                }
            )
        }

        await counterModel.create({
            course,
            courseSymbol,
            lastNumber
        })

        return Response.json(
            {
                success:true,
                message:"course counter successfully created"
            },
            {
                status:200
            }
        )
    } catch (error) {
        console.error("faield creating counter for given course",error);
        return Response.json(
            {
                success:false,
                message:"failed to create course counter"
            },
            {
                status:500
            }
        )
    }
}