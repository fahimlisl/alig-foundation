import dbConnect from "@/src/lib/dbConnect";
import Razorpay from "razorpay";
import { verifyRazorpaySignature } from "@/src/lib/utils/verifyRazorpaySignature";
import scholarshipPermissionModel from "@/src/models/scholarship.permission.model";
import { createScholarshipFromOrder } from "@/src/lib/scholarship/createScholarshipFromOrder";
import { uploadToCloudinary } from "@/src/services/cloudinary.service";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  await dbConnect();

  try {
    const formData = await request.formData();

    const full_name = formData.get("full_name") as string;
    const gurdianName = formData.get("gurdianName") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;
    const course = formData.get("course") as string;
    const gender = formData.get("gender") as string;
    const mode = formData.get("mode") as "online" | "offline";
    const avatar = formData.get("avatar") as File | null;

    const razorpay_order_id = formData.get("razorpay_order_id") as string | null;
    const razorpay_payment_id = formData.get("razorpay_payment_id") as string | null;
    const razorpay_signature = formData.get("razorpay_signature") as string | null;

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

    if (!avatar || typeof avatar === "string") {
      return Response.json(
        { success: false, message: "avatar is required" },
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

    const avatarUrl = await uploadToCloudinary(avatar, {
      folder: "scholarship/avatars",
      resourceType: "image",
    });

    if (!avatarUrl) {
      return Response.json(
        { success: false, message: "avatar upload failed" },
        { status: 500 }
      );
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