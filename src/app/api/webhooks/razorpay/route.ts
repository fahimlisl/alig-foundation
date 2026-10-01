import crypto from "crypto";
import dbConnect from "@/src/lib/dbConnect";
import razorpayOrderModel from "@/src/models/razorpay.order.model";
import { createScholarshipFromOrder } from "@/src/lib/scholarship/createScholarshipFromOrder";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return Response.json(
        { success: false, message: "missing signature" },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest("hex");

    const signaturesMatch =
      signature.length === expectedSignature.length &&
      crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );

    if (!signaturesMatch) {
      return Response.json(
        { success: false, message: "invalid webhook signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody);
    await dbConnect();

    if (event.event === "payment.captured" || event.event === "order.paid") {
      const orderId = event.payload?.payment?.entity?.order_id;

      if (!orderId) {
        return Response.json({ success: true });
      }

      const orderMeta = await razorpayOrderModel.findOne({ orderId });

      if (!orderMeta) {
        console.warn(`webhook: no snapshot found for order ${orderId}`);
        return Response.json({ success: true });
      }

      if (orderMeta.type === "scholarship") {
        const { scholarship, alreadyExisted } = await createScholarshipFromOrder({
          ...(orderMeta.scholarshipData as any),
          razorpayOrderId: orderId,
        });

        if (!orderMeta.processed) {
          await razorpayOrderModel.updateOne(
            { orderId },
            { $set: { processed: true } }
          );
        }

        console.log(
          `webhook: ${alreadyExisted ? "reused" : "created"} scholarship ${scholarship.registration_no} for order ${orderId}`
        );
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("razorpay webhook error:", error);
    // 500 so razorpay retries
    return Response.json(
      { success: false, message: "webhook processing failed" },
      { status: 500 }
    );
  }
}