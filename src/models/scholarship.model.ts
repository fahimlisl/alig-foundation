import mongoose,{Schema,Document} from "mongoose";
import { Turret_Road } from "next/font/google";

export interface Scholarship extends Document{
    avatar:string;
    full_name:string;
    gurdianName:string;
    phone:string;
    email:string | undefined;
    address:string;
    test_centre:string // will manually be allocated
    roll_no:string;
    registration_no:string;
    course:string; // or we can store objectid of course so that we can directly fetch that.
    gender: string;
    mode:"online" | "offline";
    razorpayOrderId: string; 
}


const ScholarshipSchema:Schema<Scholarship> = new Schema(
    {
        avatar:{
            type:String,
            required:true
        },
        full_name:{
            type:String,
            required:true
        },
        gurdianName:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        test_centre:{ // two types either online or offline, will be done via backend logic
            // will be choosed based on mode online or, offline
            type:String
        },
        roll_no:{
            type:String,
            required:true
        },
        registration_no:{
            type:String,
            required:true
        },
        course:{
            type:String,
            required:true
        },
        mode:{
            type:String,
            enum:["online","offline"],
            required:true            
        },
        gender:{
            type:String,
            required:true
        },
        razorpayOrderId:{
            type:String,
            unique:true,
            sparse: true,
        }
    },
    {
        timestamps:true
    }
)

const scholarshipModel = (mongoose.models.Scholarship as mongoose.Model<Scholarship>) || mongoose.model<Scholarship>("Scholarship",ScholarshipSchema)

export default scholarshipModel;