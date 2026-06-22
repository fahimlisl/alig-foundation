import dbConnect from "@/src/lib/dbConnect";
import applicationPermissionModel from "@/src/models/application.permission.model";

export async function GET() {
    await dbConnect();

    try {
        let app = await applicationPermissionModel.findOne({ key: "global" });

        if (!app) {
            app = await applicationPermissionModel.create({
                key: "global",
                admissionOpen: true,
                admissionFee: 100,
            });
        }

        return Response.json(
            {
                success: true,
                message: "successfully fetched application permission",
                data: app,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("failed to fetch permission model for application", error);
        return Response.json(
            {
                success: false,
                message: "failed to fetch permission model for application",
            },
            { status: 400 }
        );
    }
}