import dbConnect from "@/src/lib/dbConnect";
import { verifyAdminJWT } from "@/src/lib/verifyAdminJWT";
import scholarshipModel from "@/src/models/scholarship.model";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {

    const admin = verifyAdminJWT(request);

    if (!admin) {
        return Response.json(
            { success: false, message: "unauthorized — please login" },
            { status: 401 }
        );
    }

    await dbConnect();

    try {
        const applicants = await scholarshipModel.find({})
        return Response.json(
            {
                success: true,
                message: "successfully fetched all the scholarship applicants details",
                data: applicants
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.error("failed to fetch all the scholarship applicant details", error);
        return Response.json(
            {
                success: false,
                message: "failed to fetch all scholarship applicants details"
            },
            {
                status: 500
            }
        )
    }
}