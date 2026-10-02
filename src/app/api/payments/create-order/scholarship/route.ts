import Razorpay from "razorpay";
import scholarshipPermissionModel from "@/src/models/scholarship.permission.model";
import scholarshipModel from "@/src/models/scholarship.model";
import razorpayOrderModel from "@/src/models/razorpay.order.model";
import dbConnect from "@/src/lib/dbConnect";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  await dbConnect();

  try {
    const {
      full_name,
      gurdianName,
      phone,
      email,
      address,
      course,
      gender,
      mode,
      avatarUrl, 
      avatarPublicId  
    } = await request.json();

    if (
      [full_name, gurdianName, phone, email, address, course, gender, mode].some(
        (t) => !t
      )
    ) {
      return Response.json(
        { success: false, message: "every field is required" },
        { status: 400 }
      );
    }

    if (!["online", "offline"].includes(mode)) {
      return Response.json(
        { success: false, message: "invalid mode" },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { success: false, message: "invalid email" },
        { status: 400 }
      );
    }

    const existing = await scholarshipModel.findOne({ phone, course });
    if (existing) {
      return Response.json(
        {
          success: false,
          message: `this phone number has already registered for the scholarship for course ${course}, registration no ${existing.registration_no}`,
        },
        { status: 400 }
      );
    }

    const permission = await scholarshipPermissionModel.findOne({
      key: "scholarship",
    });
    const scholarshipFee = permission?.scholarshipFee ?? 0;

    const snapshot = {
      full_name,
      gurdianName,
      phone,
      email,
      address,
      course,
      gender,
      mode,
      avatarUrl,
      avatarPublicId,
    };

    if (scholarshipFee === 0) {
      return Response.json(
        { success: true, free: true, message: "scholarship registration is free" },
        { status: 200 }
      );
    }

    const order = await razorpay.orders.create({
      amount: scholarshipFee * 100,
      currency: "INR",
      receipt: `scholarship_${Date.now()}`,
      notes: { email, phone, course },
    });

    await razorpayOrderModel.create({
      orderId: order.id,
      type: "scholarship",
      amount: scholarshipFee,
      scholarshipData: snapshot,
      processed: false,
    });

    return Response.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error("Error creating Razorpay order for scholarship:", error);
    return Response.json(
      { success: false, message: "Failed to create payment order" },
      { status: 500 }
    );
  }
}