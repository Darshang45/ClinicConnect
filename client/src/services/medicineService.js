import api from "./api";

export const getMedicines = async () => {
  const { data } = await api.get("/medicines");
  return data;
};

export const searchMedicines = async (keyword) => {
  const { data } = await api.get(
    `/medicines/search?keyword=${keyword}`
  );

  return data;
};

export const getMedicinesByCategory = async (
  category
) => {
  const { data } = await api.get(
    `/medicines/category/${category}`
  );

  return data;
};