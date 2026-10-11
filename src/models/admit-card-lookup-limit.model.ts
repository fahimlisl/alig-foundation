import mongoose, { Schema, type Document } from "mongoose";

interface LookupLimit extends Document {
  key: string;
  count: number;
  expiresAt: Date;
}

const LookupLimitSchema = new Schema<LookupLimit>(
  {
    key: { type: String, required: true, unique: true },
    count: { type: Number, required: true, default: 0 },
    expiresAt: { type: Date, required: true },
  },
  { versionKey: false }
);

// TTL deletes stale counter documents later. This does NOT store PDFs or candidate data.
LookupLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const LookupLimitModel =
  (mongoose.models.AdmitCardLookupLimit as mongoose.Model<LookupLimit>) ||
  mongoose.model<LookupLimit>("AdmitCardLookupLimit", LookupLimitSchema);

export default LookupLimitModel;
