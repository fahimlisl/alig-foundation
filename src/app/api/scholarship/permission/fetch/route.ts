import dbConnect from "@/src/lib/dbConnect";
import scholarshipPermissionModel from "@/src/models/scholarship.permission.model";

export async function GET() {
    await dbConnect();

    try {
        let app = await scholarshipPermissionModel.findOne({ key: "scholarship" });

        if (!app) {
            app = await scholarshipPermissionModel.create({
                key: "scholarship",
                scholarshipOpen: true,
                scholarshipFee: 0,
                scholarshipLastDate: null,
            });
        }

        return Response.json(
            {
                success: true,
                message: "successfully fetched scholarship permission",
                data: app,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("failed to fetch permission model for scholarship", error);
        return Response.json(
            {
                success: false,
                message: "failed to fetch permission model for scholarship",
            },
            { status: 400 }
        );
    }
}