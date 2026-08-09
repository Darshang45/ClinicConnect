import api from "./api";

export const getPharmacyPrescriptions = async () => {
  const { data } = await api.get(
    "/pharmacy/prescriptions"
  );

  return data;
};

export const createPharmacyOrder = async (
  prescription,
  items
) => {
  const { data } = await api.post("/pharmacy", {
    prescription,
    items,
  });

  return data;
};

export const getPharmacyOrderByPrescription = async (
  prescriptionId
) => {
  const { data } = await api.get(
    `/pharmacy/prescription/${prescriptionId}`
  );

  return data;
};