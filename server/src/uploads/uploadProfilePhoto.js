import path from "path";
import multer from "multer";

const allowedMimeTypes = new Set(["image/jpeg", "image/png"]);
const allowedExtensions = new Set([".jpg", ".jpeg", ".png"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedMimeTypes.has(file.mimetype) || !allowedExtensions.has(extension)) {
      callback(new Error("Only JPG, JPEG, and PNG image files are allowed."));
      return;
    }

    callback(null, true);
  },
});

const uploadProfilePhoto = (req, res, next) => {
  upload.single("profilePhoto")(req, res, (error) => {
    if (!error) return next();

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Profile photo must be 5 MB or smaller.",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to upload the profile photo.",
    });
  });
};

export default uploadProfilePhoto;
