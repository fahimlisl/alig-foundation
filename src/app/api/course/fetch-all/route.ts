import dbConnect from "@/src/lib/dbConnect";
import courseModel from "@/src/models/course.model";

export async function GET() {
    await dbConnect()
    try {
        const c = await courseModel.find({}).sort({ order: 1, createdAt: 1 });
        return Response.json(
            {
                success:true,
                message:"successfully fetched all the courses",
                data: c
            },
            {
                status:200
            }
        )
    } catch (error) {
        console.error("failed to fetch all the courses",error);
        return Response.json(
            {
                success:false,
                message:"faield to fetch all the courses"
            },
            {
                status:500
            }
        )
    }
}