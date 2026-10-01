import mongoose, { Schema, Document } from "mongoose";

export interface RazorpayOrder extends Document {
  orderId: string;
  type: "application" | "scholarship";
  amount: number;
  applicationData?: Record<string, any>;
  scholarshipData?: Record<string, any>;
  processed: boolean;
}

const razorpayOrderSchema: Schema<RazorpayOrder> = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["application", "scholarship"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    applicationData: {
      type: Schema.Types.Mixed,
    },
    scholarshipData: {
      type: Schema.Types.Mixed,
    },
    processed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const razorpayOrderModel =
  (mongoose.models.RazorpayOrder as mongoose.Model<RazorpayOrder>) ||
  mongoose.model<RazorpayOrder>("RazorpayOrder", razorpayOrderSchema);

export default razorpayOrderModel;