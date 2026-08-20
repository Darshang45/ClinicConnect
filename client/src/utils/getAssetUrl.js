import api from "../services/api";

const getAssetUrl = (assetPath) => {
  if (!assetPath || /^(https?:)?\/\//i.test(assetPath) || assetPath.startsWith("data:")) {
    return assetPath;
  }

  try {
    return new URL(assetPath, api.defaults.baseURL).toString();
  } catch {
    return assetPath;
  }
};

export default getAssetUrl;
