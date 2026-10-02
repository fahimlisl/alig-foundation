import { deleteFromCloudinary } from "@/src/services/cloudinary.service";

export async function POST(request: Request) {
  try {
    const { public_id } = await request.json();
    if (!public_id) {
      return Response.json({ success: false, message: "public_id required" }, { status: 400 });
    }
    await deleteFromCloudinary(public_id);
    return Response.json({ success: true });
  } catch {
    return Response.json({ success: false }, { status: 500 });
  }
}