import Patient from "../models/Patient.js";

export const generatePatientId = async () => {

    const lastPatient = await Patient.findOne()
        .sort({ createdAt: -1 })
        .select("patientId");

    if (!lastPatient) {
        return "PAT000001";
    }

    const number = parseInt(
        lastPatient.patientId.replace("PAT", "")
    );

    return `PAT${String(number + 1).padStart(6, "0")}`;
};