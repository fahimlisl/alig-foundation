import mongoose,{Schema,Document, Types} from "mongoose";

interface ScholarCounter extends Document {
    course: Types.ObjectId;
    lastNumber: number;
    courseSymbol: string;
}

const ScholarshipCounterSchema:Schema<ScholarCounter> = new mongoose.Schema({
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

const ScholarCounterModel =
  (mongoose.models.ScholarShipCounter as mongoose.Model<ScholarCounter>) ||
  mongoose.model<ScholarCounter>("ScholarShipCounter", ScholarshipCounterSchema);

export default ScholarCounterModel;