import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

export const uploadProfilePhoto = (file, { folder, publicId }) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "image",
        overwrite: false,
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      },
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });

export const deleteCloudinaryProfilePhoto = async (profilePhoto) => {
  const match = String(profilePhoto || "").match(
    /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:v\d+\/)?(.+)\.(?:jpg|jpeg|png)$/i,
  );

  if (!match) return;

  await cloudinary.uploader.destroy(match[1], { resource_type: "image" });
};
