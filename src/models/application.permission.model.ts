import mongoose, { Document, Schema } from "mongoose";

export interface ApplicationPermission extends Document {
    key: string;
    admissionOpen: boolean;
    admissionFee?: number;
}

const applicationPermissionSchema: Schema<ApplicationPermission> = new Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            default: "global", 
        },
        admissionOpen: {
            type: Boolean,
            required: true,
        },
        admissionFee: {
            type: Number,
            default: 100,
        },
    },
    { timestamps: true }
);

// in future we will be fetching the admission fee from the backend directly itself

const applicationPermissionModel =
    (mongoose.models.ApplicationPermission as mongoose.Model<ApplicationPermission>) ||
    mongoose.model<ApplicationPermission>("ApplicationPermission", applicationPermissionSchema);

export default applicationPermissionModel;