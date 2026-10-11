import dbConnect from "@/src/lib/dbConnect";
import { verifyAdminJWT } from "@/src/lib/verifyAdminJWT";
import scholarshipPermissionModel from "@/src/models/scholarship.permission.model";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
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
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        success: false,
        message: "Invalid JSON request body",
      },
      { status: 400 }
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return Response.json(
      {
        success: false,
        message: "Invalid request data",
      },
      { status: 400 }
    );
  }

  const {
    scholarshipOpen,
    scholarshipFee,
    scholarshipLastDate,
    issueAdmitCard,
  } = body as Record<string, unknown>;

  if (typeof scholarshipOpen !== "boolean") {
    return Response.json(
      {
        success: false,
        message:
          "scholarshipOpen must be a boolean",
      },
      { status: 400 }
    );
  }
  if (
    issueAdmitCard !== undefined &&
    typeof issueAdmitCard !== "boolean"
  ) {
    return Response.json(
      {
        success: false,
        message:
          "issueAdmitCard must be a boolean",
      },
      { status: 400 }
    );
  }
  if (
    scholarshipFee !== undefined &&
    (
      typeof scholarshipFee !== "number" ||
      !Number.isFinite(scholarshipFee) ||
      scholarshipFee < 0
    )
  ) {
    return Response.json(
      {
        success: false,
        message:
          "scholarshipFee must be a valid non-negative number",
      },
      { status: 400 }
    );
  }

  if (
    scholarshipLastDate !== undefined &&
    scholarshipLastDate !== null &&
    (
      typeof scholarshipLastDate !== "string" ||
      !Number.isFinite(
        Date.parse(scholarshipLastDate)
      )
    )
  ) {
    return Response.json(
      {
        success: false,
        message: "Invalid scholarshipLastDate",
      },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const updated =
      await scholarshipPermissionModel.findOneAndUpdate(
        {
          key: "scholarship",
        },
        {
          $set: {
            scholarshipOpen,

            ...(scholarshipFee !== undefined
              ? { scholarshipFee }
              : {}),

            ...(scholarshipLastDate !== undefined
              ? {
                  scholarshipLastDate:
                    scholarshipLastDate === null
                      ? null
                      : new Date(
                          scholarshipLastDate as string
                        ),
                }
              : {}),

            ...(issueAdmitCard !== undefined
              ? { issueAdmitCard }
              : {}),
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
          runValidators: true,
        }
      );

    return Response.json(
      {
        success: true,
        message:
          "Scholarship settings updated successfully",
        data: updated,
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
      "Failed to update scholarship permission",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Failed to update scholarship settings",
      },
      { status: 500 }
    );
  }
}