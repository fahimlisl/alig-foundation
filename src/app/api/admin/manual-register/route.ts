import applicationModel from "@/src/models/application.model";
import dbConnect from "@/src/lib/dbConnect";
import counterModel from "@/src/models/counter.model";
import courseModel from "@/src/models/course.model";
import { REGISTRATION_FEE } from "@/src/lib/constants/payment";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const {
      name,
      gurdianName,
      gurdianPhoneNumber,
      phoneNumber,
      email,
      gender,
      course,
      schoolBoardName,
      permanentAddress,
      state,
      district,
      pin,
    } = await request.json();

    // Validate required fields
    if (
      [
        name,
        gurdianName,
        gurdianPhoneNumber,
        phoneNumber,
        gender,
        course,
        schoolBoardName,
        permanentAddress,
        state,
        district,
        pin,
      ].some((t) => !t && t !== 0)
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email
    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check for existing application with same phone and course
    const existingApplication = await applicationModel.findOne({
      phoneNumber,
      course,
    });

    const choosenCourse = await courseModel.findById(course);
    if (existingApplication) {
      return NextResponse.json(
        {
          success: false,
          message: `Course ${choosenCourse?.title} has already been registered with this phone number. Application ID: ${existingApplication?.applicationId}`,
        },
        { status: 400 }
      );
    }

    // Generate application ID
    const c = await counterModel.findOneAndUpdate(
      { course },
      { $inc: { lastNumber: 1 } },
      { upsert: true, new: true }
    );
    const applicationId = `E${c.lastNumber.toString().padStart(4, "0")}${c.courseSymbol}`;

    // Create application without payment details
    const application = await applicationModel.create({
      applicationId,
      name,
      gurdianName,
      gurdianPhoneNumber,
      phoneNumber,
      email,
      gender,
      course,
      schoolBoardName,
      permanentAddress,
      state,
      district,
      pin,
      razorpayOrderId: "manual registration", // No payment details since this is a manual registration
      // No razorpay fields since admin manually registered
    });

    return NextResponse.json(
      {
        success: true,
        message: `Student registered successfully! Application ID: ${application?.applicationId}`,
        data: {
          applicationId: application.applicationId,
          name: application.name,
          course: choosenCourse?.title,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in manual registration:", error);
    return NextResponse.json(
      { success: false, message: "Failed to register student" },
      { status: 500 }
    );
  }
}