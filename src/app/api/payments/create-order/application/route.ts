import Razorpay from "razorpay";
import { REGISTRATION_FEE } from "@/src/lib/constants/payment";
import applicationModel from "@/src/models/application.model";
import courseModel from "@/src/models/course.model";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request:Request) {
  try {
    const {phoneNumber,course} = await request.json()
    const existingApplicationOfSameCourse = await applicationModel.findOne({
      phoneNumber,
      course
    });
    const choosenCourse = await courseModel.findById(course)
    if (existingApplicationOfSameCourse) {
    return Response.json(
      {
        success: false,
        message: `course ${choosenCourse?.title} has been already registered before via the same phone number , application Id ${existingApplicationOfSameCourse?.applicationId}`
      },
      { status: 400 }
      );
      }
    const order = await razorpay.orders.create({
      amount: REGISTRATION_FEE * 100, // paise
      currency: "INR",
      receipt: `reg_${Date.now()}`,
    });

    return Response.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return Response.json(
      { success: false, message: "Failed to create payment order" },
      { status: 500 }
    );
  }
}