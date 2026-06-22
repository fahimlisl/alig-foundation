import dbConnect from "@/src/lib/dbConnect";
import { verifyAdminJWT } from "@/src/lib/verifyAdminJWT";
import applicationModel from "@/src/models/application.model";
import { NextRequest } from "next/server";

export async function GET(request:NextRequest) {

    const admin = verifyAdminJWT(request);
 
    if (!admin) {
        return Response.json(
            { success: false, message: "unauthorized — please login" },
            { status: 401 }
        );
    }


    await dbConnect();

    try {
        const applicants = await applicationModel.find({}).populate("course")
        return Response.json(
            {
                success:true,
                message:"successfully fetched all the applicants details",
                data: applicants
            },
            {
                status:200
            }
        )
    } catch (error) {
        console.error("failed to fetch all the applicant details",error);
        return Response.json(
            {
                success:false,
                message:"failed to fetch all applicants details"
            },
            {
                status:500
            }
        )
    }
}