import { uploadToCloudinary } from "@/src/services/cloudinary.service";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || typeof file === "string") {
      return Response.json({ success: false, message: "file is required" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return Response.json({ success: false, message: "only images allowed" }, { status: 400 });
    }
    if (file.size > 2 * 1024 * 1024) {
      return Response.json({ success: false, message: "max 2 MB" }, { status: 400 });
    }

    const { url, public_id } = await uploadToCloudinary(file, {
      folder: "scholarship/avatars",
      resourceType: "image",
    });

    return Response.json({ success: true, url, public_id }, { status: 200 });
  } catch (error) {
    console.error("upload failed:", error);
    return Response.json({ success: false, message: "upload failed" }, { status: 500 });
  }
}