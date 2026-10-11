
import { NextResponse } from "next/server";
import dbConnect from "@/src/lib/dbConnect";
import scholarshipPermissionModel from "@/src/models/scholarship.permission.model";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();

    const permission = await scholarshipPermissionModel
      .findOne({ key: "scholarship" })
      .select("issueAdmitCard")
      .lean();

    const issueAdmitCard =
      permission?.issueAdmitCard === true;

    return NextResponse.json(
      {
        success: true,
        issueAdmitCard,
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
      "Failed to fetch admit card permission:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        issueAdmitCard: false,
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
