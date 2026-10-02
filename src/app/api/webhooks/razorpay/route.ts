import crypto from "crypto";
import dbConnect from "@/src/lib/dbConnect";
import razorpayOrderModel from "@/src/models/razorpay.order.model";
import { createScholarshipFromOrder } from "@/src/lib/scholarship/createScholarshipFromOrder";
import { deleteFromCloudinary } from "@/src/services/cloudinary.service";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return Response.json({ success: false, message: "missing signature" }, { status: 400 });
    }

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest("hex");

    const match =
      signature.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

    if (!match) {
      return Response.json({ success: false, message: "invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    await dbConnect();

    const orderId =
      event.payload?.payment?.entity?.order_id ??
      event.payload?.order?.entity?.id;

    if (!orderId) return Response.json({ success: true });

    const orderMeta = await razorpayOrderModel.findOne({ orderId });
    if (!orderMeta) {
      console.warn(`webhook: no snapshot for order ${orderId}`);
      return Response.json({ success: true });
    }

    if (event.event === "order.paid" || event.event === "payment.captured") {
      if (orderMeta.processed) {
        return Response.json({ success: true }); // already handled
      }

      if (orderMeta.type === "scholarship") {
        const { scholarship, alreadyExisted } = await createScholarshipFromOrder({
          ...(orderMeta.scholarshipData as any),
          razorpayOrderId: orderId,
        });

        await razorpayOrderModel.updateOne(
          { orderId },
          { $set: { processed: true } }
        );

        console.log(
          `webhook: ${alreadyExisted ? "reused" : "created"} ${scholarship.registration_no}`
        );
      }
    }

    if (event.event === "payment.failed") {
      const publicId = (orderMeta.scholarshipData as any)?.avatarPublicId;
      if (publicId && !orderMeta.processed) {
        const deleted = await deleteFromCloudinary(publicId);
        console.log(
          `webhook: payment failed for ${orderId}, image ${deleted ? "deleted" : "delete-failed"}`
        );
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("webhook error:", error);
    return Response.json({ success: false, message: "webhook failed" }, { status: 500 });
  }
}