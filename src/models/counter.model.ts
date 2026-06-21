import mongoose,{Schema,Document, Types} from "mongoose";
import { required, toUpperCase } from "zod/mini";

interface Counter extends Document {
    course: Types.ObjectId;
    lastNumber: number;
    courseSymbol: string;
}

const counterSchema:Schema<Counter> = new mongoose.Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref:"Course",
    required: true,
  },
  courseSymbol: {
    type:String,
    required:true,
    toUpperCase:true
  },
  lastNumber: {
    type: Number,
    default: 0,
  },
});

const counterModel = (mongoose.models.Counter as mongoose.Model<Counter>) || mongoose.model<Counter>("Counter", counterSchema);

export default counterModel