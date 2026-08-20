import { useEffect, useState } from "react";
import getAssetUrl from "../../utils/getAssetUrl";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedMimeTypes = new Set(["image/jpeg", "image/png"]);
const allowedExtensions = new Set([".jpg", ".jpeg", ".png"]);

function ProfilePhotoUpload({
  currentPhoto = "",
  fallbackImage,
  label = "Profile Photo",
  disabled = false,
  onFileChange,
  onPreviewChange,
  showPreview = true,
  resetKey,
  className = "",
}) {
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setPreview(getAssetUrl(currentPhoto) || fallbackImage || "");
    onPreviewChange?.("");
    setError("");
  }, [currentPhoto, fallbackImage, resetKey]);

  const handleChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const extension = `.${file.name.split(".").pop()?.toLowerCase() || ""}`;
    if (!allowedMimeTypes.has(file.type) || !allowedExtensions.has(extension)) {
      setError("Choose a JPG, JPEG, or PNG image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Profile photo must be 5 MB or smaller.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview((previousPreview) => {
      if (previousPreview?.startsWith("blob:")) URL.revokeObjectURL(previousPreview);
      return objectUrl;
    });
    setError("");
    onFileChange?.(file);
    onPreviewChange?.(objectUrl);
  };

  useEffect(
    () => () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  return (
    <div className={className}>
      <label style={{ display: "block", fontWeight: 600, marginBottom: "8px" }}>
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        {showPreview && preview && (
          <img
            src={preview}
            alt="Profile preview"
            style={{ width: "72px", height: "72px", borderRadius: "50%", objectFit: "cover" }}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = fallbackImage;
            }}
          />
        )}
        <input
          type="file"
          accept="image/jpeg,image/png"
          disabled={disabled}
          onChange={handleChange}
        />
      </div>
      <small>JPG, JPEG, or PNG. Maximum 5 MB.</small>
      {error && <small style={{ color: "#b91c1c", display: "block" }}>{error}</small>}
    </div>
  );
}

export default ProfilePhotoUpload;
