import mongoose,{Schema,Document} from "mongoose";
import bcrypt from "bcryptjs";


interface Admin extends Document {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    adminRefreshToken: string;
}

const adminSchema: Schema<Admin> = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        phoneNumber:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        adminRefreshToken:{
            type:String
        }
    },
    {
        timestamps:true
    }
)


adminSchema.pre("save",async function () {
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password,10);
})


const adminModel = (mongoose.models.Admin as mongoose.Model<Admin>) || mongoose.model<Admin>("Admin",adminSchema)

export default adminModel