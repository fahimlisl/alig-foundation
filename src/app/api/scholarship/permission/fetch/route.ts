import { NextRequest } from "next/server";
import dbConnect from "@/src/lib/dbConnect";
import { verifyAdminJWT } from "@/src/lib/verifyAdminJWT";
import scholarshipPermissionModel from "@/src/models/scholarship.permission.model";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const admin = verifyAdminJWT(request);

  if (!admin) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized — please login",
      },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const permission =
      await scholarshipPermissionModel
        .findOne({ key: "scholarship" })
        .select(
          "scholarshipOpen scholarshipFee scholarshipLastDate issueAdmitCard"
        )
        .lean();

    return Response.json(
      {
        success: true,
        data: {
          scholarshipOpen:
            permission?.scholarshipOpen ?? true,

          scholarshipFee:
            permission?.scholarshipFee ?? 0,

          scholarshipLastDate:
            permission?.scholarshipLastDate ?? null,

          issueAdmitCard:
            permission?.issueAdmitCard === true,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Failed to fetch scholarship settings",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Failed to fetch scholarship settings",
      },
      { status: 500 }
    );
  }
}