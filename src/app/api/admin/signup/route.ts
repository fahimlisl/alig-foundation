import adminModel from "@/src/models/admin.model";
import dbConnect from "@/src/lib/dbConnect";

export async function POST(request:Request) {
    await dbConnect();

    try {
        const {email,phoneNumber,name,password} = await request.json();
        if([email,phoneNumber,name,password].some((t) => !t && t !== 0)){
            return Response.json(
                {
                    success:false,
                    message:"each field is required"
                },
                {
                    status:404
                }
            )
        }

        const preExisistingAdmin = await adminModel.findOne(
            {
                $or:[
                    {phoneNumber},{email}
                ]
            }
        )

        if(preExisistingAdmin) {
            return Response.json(
                {
                    success:false,
                    message:"admin already exists with the same phone number or email address"
                },
                {
                    status:401
                }
            )
        }

        await adminModel.create({
            name,
            email,
            phoneNumber,
            password
        })
    } catch (error) {
        console.error("error while signing up the admin",error);
        return Response.json(
            {
                success:false,
                message:"failed while sigining up the admin"
            },
            {
                status:500
            }
        )
    }
}