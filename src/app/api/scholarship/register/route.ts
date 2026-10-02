import dbConnect from "@/src/lib/dbConnect";
import Razorpay from "razorpay";
import { verifyRazorpaySignature } from "@/src/lib/utils/verifyRazorpaySignature";
import scholarshipPermissionModel from "@/src/models/scholarship.permission.model";
import razorpayOrderModel from "@/src/models/razorpay.order.model";
import { createScholarshipFromOrder } from "@/src/lib/scholarship/createScholarshipFromOrder";

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
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await request.json();

    if (
      [full_name, gurdianName, phone, email, address, course, gender, mode, avatarUrl].some(
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

    if (typeof avatarUrl !== "string") {
      return Response.json(
        { success: false, message: "avatarUrl must be a string" },
        { status: 400 }
      );
    }

    const permission = await scholarshipPermissionModel.findOne({
      key: "scholarship",
    });
    const scholarshipFee = permission?.scholarshipFee ?? 0;

    if (scholarshipFee > 0) {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return Response.json(
          { success: false, message: "payment details are missing" },
          { status: 400 }
        );
      }

      const isValidSignature = verifyRazorpaySignature({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      });

      if (!isValidSignature) {
        return Response.json(
          { success: false, message: "payment verification failed" },
          { status: 400 }
        );
      }

      const order = await razorpay.orders.fetch(razorpay_order_id);

      if (order.status !== "paid") {
        return Response.json(
          { success: false, message: "payment not completed" },
          { status: 400 }
        );
      }

      if (order.amount !== scholarshipFee * 100) {
        return Response.json(
          { success: false, message: "payment amount mismatch" },
          { status: 400 }
        );
      }
    }

                   
    const { scholarship, alreadyExisted } = await createScholarshipFromOrder({
      full_name,
      gurdianName,
      phone,
      email,
      address,
      course,
      gender,
      mode,
      avatarUrl,
      razorpayOrderId: razorpay_order_id ?? undefined,
    });

    if (razorpay_order_id) {
      await razorpayOrderModel.updateOne(
        { orderId: razorpay_order_id },
        { $set: { processed: true } }
      );
    }

    return Response.json(
      {
        success: true,
        message: alreadyExisted
          ? `registration already exists. Roll No: ${scholarship.roll_no}, Registration No: ${scholarship.registration_no}`
          : `scholarship registration successful. Roll No: ${scholarship.roll_no}, Registration No: ${scholarship.registration_no}`,
        data: {
          roll_no: scholarship.roll_no,
          registration_no: scholarship.registration_no,
          test_centre: scholarship.test_centre,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("error while registering scholarship:", error);
    return Response.json(
      { success: false, message: "Error registering scholarship" },
      { status: 500 }
    );
  }
}