import mongoose, {Schema,Document, Types} from "mongoose";

export interface Application extends Document {
    applicationId: string;
    name: string;
    gurdianName: string;
    phoneNumber: string; // this one is studnets phone number
    gurdianPhoneNumber: number;
    gender: string;
    course: Types.ObjectId; // will be fetched from db or manually will be hardcoded .. 
    schoolBoardName: string; // name of the school board name of 12th
    permanentAddress: string;
    state: string;
    district: string;
    pin: number;
    razorpayOrderId: string;
}


const applicationSchema: Schema<Application> = new Schema({
    applicationId:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    gurdianName:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true,
        // unique:true // make it true as of now // single studnet can apply for multiple courses , bt only one time for a single course
    },
    gurdianPhoneNumber:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        enum:["Male","Female","Prefer Not to Say"]
    },
    course:{ // can be converted in futer to object id
        type: Schema.Types.ObjectId,
        ref:"Course"
    },
    schoolBoardName:{
        type:String,
        required:true
    },
    permanentAddress:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    pin:{
        type:Number,
        required:true
    },
    razorpayOrderId: {
        type: String,
        required: true,
        unique: true
    },
},
{
    timestamps:true
})


const applicationModel = (mongoose.models.Application as mongoose.Model<Application>) || mongoose.model<Application>("Application",applicationSchema)

export default applicationModel;