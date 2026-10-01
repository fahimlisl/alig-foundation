import mongoose, { Document, Schema } from "mongoose";

export interface ScholarshipPermission extends Document {
    key: string;
    scholarshipOpen: boolean;
    scholarshipFee?: number;
    scholarshipLastDate?: Date | null;
}

const scholarshipPermissionSchema: Schema<ScholarshipPermission> = new Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            default: "scholarship",
        },
        scholarshipOpen: {
            type: Boolean,
            required: true,
        },
        scholarshipFee: {
            type: Number,
            default: 0,
        },
        scholarshipLastDate: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);


const scholarshipPermissionModel =
    (mongoose.models.ScholarshipPermission as mongoose.Model<ScholarshipPermission>) ||
    mongoose.model<ScholarshipPermission>("ScholarshipPermission", scholarshipPermissionSchema);

export default scholarshipPermissionModel;