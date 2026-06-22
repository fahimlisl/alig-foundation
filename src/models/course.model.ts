import mongoose,{Document,Schema} from "mongoose";

export interface Course extends Document {
    title: string;
    description: string;
    overview: string; // when user goes to view details 
    basePrice?: number;
    finalPrice: number;
    duration: string; // like 1 year or 5 months
    highlights : Highlights[];
    order: number;
}

export interface Highlights {
    title: string;
}

const hihgLightSchema:Schema<Highlights> = new Schema(
    {
        title:{
            type:String
        }
    }
)

const courseSchema:Schema<Course> = new Schema(
    {
        order:{
            type:Number,
            required:true
        },
        title:{
            type: String,
            required:true
        },
        overview:{
            type: String
        },
        description:{
            type:String,
            required:true
        },
        basePrice:{
            type: Number
        },
        finalPrice:{
            type:Number,
            required:true
        },
        duration:{
            type:String,
            required:true
        },
        highlights: {
            type: [hihgLightSchema]
        }
    }
)


const courseModel = (mongoose.models.Course as mongoose.Model<Course>) || mongoose.model<Course>("Course",courseSchema)

export default courseModel;