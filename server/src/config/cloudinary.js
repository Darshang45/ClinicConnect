import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";

const serverDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

// This module is evaluated while the Express import graph is loading, before
// server.js can run dotenv.config() in an ES-module application.
dotenv.config({ path: path.join(serverDirectory, ".env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
