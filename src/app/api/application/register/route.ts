import applicationModel from "@/src/models/application.model";
import dbConnect from "@/src/lib/dbConnect";
import counterModel from "@/src/models/counter.model";
import Razorpay from "razorpay";
import { verifyRazorpaySignature } from "@/src/lib/utils/verifyRazorpaySignature";
import { REGISTRATION_FEE } from "@/src/lib/constants/payment";
import courseModel from "@/src/models/course.model";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
    await dbConnect();

    try {
        const {
            name, gurdianName, gurdianPhoneNumber, phoneNumber, gender,
            course, schoolBoardName, permanentAddress, state, district, pin,
            razorpay_order_id, razorpay_payment_id, razorpay_signature
        } = await request.json();

        if ([name, gurdianName, gurdianPhoneNumber, gender, course, schoolBoardName, permanentAddress, state, district, pin].some((t) => !t && t !== 0)) {
            return Response.json(
                { success: false, message: "every field is must required" },
                { status: 400 }
            );
        }

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

        if (order.amount !== REGISTRATION_FEE * 100) {
            return Response.json(
                { success: false, message: "payment amount mismatch" },
                { status: 400 }
            );
        }

        const orderAlreadyUsed = await applicationModel.findOne({ razorpayOrderId: razorpay_order_id });
        if (orderAlreadyUsed) {
            return Response.json(
                { success: false, message: "this payment has already been used for a registration" },
                { status: 400 }
            );
        }

        const c = await counterModel.findOneAndUpdate(
            {course},
            { $inc: { lastNumber: 1 } },
            { upsert: true, new: true }
        );
        const applicationId = `${new Date().getFullYear().toString().slice(-2)}${c.courseSymbol}${c.lastNumber.toString().padStart(4, "0")}`;

        const application = await applicationModel.create({
            applicationId,
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
            razorpayOrderId: razorpay_order_id,
        });

        return Response.json(
            {
                success: true,
                message: `application registration successfull for applicationId ${application?.applicationId} and course ${choosenCourse?.title}`
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("error while registering application :", error);
        return Response.json(
            { success: false, message: "Error registering application" },
            { status: 500 }
        );
    }
}