import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadOptions {
  folder?: string;
  resourceType?: "image" | "video" | "raw" | "auto";
}

export async function uploadToCloudinary(
  file: File,
  { folder = "uploads", resourceType = "image" }: UploadOptions = {}
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder, resource_type: resourceType },
        (error, result) => {
          if (error || !result) {
            return reject(error ?? new Error("cloudinary upload failed"));
          }
          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
}