export const createCaseInsensitiveSearchRegex = (value) => {
  const normalizedValue = String(value || "").trim();

  if (!normalizedValue) {
    return null;
  }

  const escapedValue = normalizedValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return new RegExp(escapedValue, "i");
};
