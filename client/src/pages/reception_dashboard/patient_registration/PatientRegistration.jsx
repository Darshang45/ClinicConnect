import { useEffect, useMemo, useState } from "react";
import { AppointmentForm } from "../../landing/appointment/Appointment";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import "../../../styles/reception_dashboard.css";

import {
  getReceptionistDepartments,
  getReceptionistDoctors,
  getTodayAppointments,
} from "../../../services/receptionistservice";

const initialPatientData = {
  firstName: "",
  lastName: "",
  dob: "",
  phone: "",
  email: "",
  gender: "",
  doctor: "",
  department: "",
  bloodGroup: "",
  height: "",
  weight: "",
  symptoms: "",
  appointmentDate: "",
  appointmentTime: "",
  appointmentStatus: "Waiting",
};

const fields = [
  {
    label: "First Name",
    name: "firstName",
    placeholder: "John",
    required: true,
  },
  {
    label: "Last Name",
    name: "lastName",
    placeholder: "Doe",
    required: true,
  },
  {
    label: "Date of Birth",
    name: "dob",
    type: "date",
    required: true,
  },
  {
    label: "Phone Number",
    name: "phone",
    placeholder: "+1 (555) 000-0000",
    type: "tel",
    required: true,
  },
  {
    label: "Email Address",
    name: "email",
    placeholder: "john@example.com",
    type: "email",
    required: true,
  },
  {
    label: "Gender",
    name: "gender",
    as: "select",
    options: ["Female", "Male", "Other"],
    required: true,
  },
  {
    label: "Blood Group",
    name: "bloodGroup",
    as: "select",
    options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true,
  },
  {
    label: "Height",
    name: "height",
    placeholder: "e.g. 170 cm",
    required: true,
  },
  {
    label: "Weight",
    name: "weight",
    placeholder: "e.g. 68 kg",
    required: true,
  },
];

function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTime(timeInMinutes) {
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;

  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;

  return `${String(displayHour).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )} ${period}`;
}

function createTimeSlots(duration) {
  const slots = [];

  const startMinutes = 10 * 60; // 10:00 AM
  const endMinutes = 17 * 60; // 5:00 PM

  for (
    let current = startMinutes;
    current + duration <= endMinutes;
    current += duration
  ) {
    const end = current + duration;

    slots.push({
      value: `${current}-${end}`,
      label: `${formatTime(current)} - ${formatTime(end)}`,
      startMinutes: current,
      endMinutes: end,
    });
  }

  return slots;
}

function PatientRegistration({
  additionalFields = [],
  onRegister,
  submitLabel = "Book Appointment",
  title = "Patient Registration",
  existingPatient = null,
  onClearExistingPatient,
}) {
  const getInitialData = () =>
    additionalFields.reduce(
      (data, field) => ({
        ...data,
        [field.name]: "",
      }),
      { ...initialPatientData },
    );

  const [patientData, setPatientData] = useState(getInitialData);

  useEffect(() => {
    if (existingPatient) {
      const nameParts = (existingPatient.fullName || "").trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      const dobFormatted = existingPatient.dateOfBirth
        ? new Date(existingPatient.dateOfBirth).toISOString().split("T")[0]
        : "";

      setPatientData((current) => ({
        ...current,
        firstName,
        lastName,
        dob: dobFormatted,
        phone: existingPatient.phone || "",
        email: existingPatient.email || "",
        gender: existingPatient.gender || "",
        bloodGroup: existingPatient.bloodGroup || "",
        address: existingPatient.address || "",
        height: "170 cm",
        weight: "70 kg",
      }));
    }
  }, [existingPatient]);

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const [departmentError, setDepartmentError] = useState("");
  const [doctorError, setDoctorError] = useState("");
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [loadingBookedSlots, setLoadingBookedSlots] = useState(false);
  const [appointmentError, setAppointmentError] = useState("");

  /*
   * --------------------------------------------------
   * LOAD DEPARTMENTS
   * --------------------------------------------------
   */

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setLoadingDepartments(true);
        setDepartmentError("");

        const response = await getReceptionistDepartments();

        setDepartments(response.data || response.departments || []);
      } catch (error) {
        console.error("Failed to load departments:", error);

        setDepartmentError(
          error.response?.data?.message || "Failed to load departments.",
        );
      } finally {
        setLoadingDepartments(false);
      }
    };

    loadDepartments();
  }, []);

  /*
   * --------------------------------------------------
   * LOAD DOCTORS WHEN DEPARTMENT CHANGES
   * --------------------------------------------------
   */

  useEffect(() => {
    if (!patientData.department) {
      setDoctors([]);
      return;
    }

    const loadDoctors = async () => {
      try {
        setLoadingDoctors(true);
        setDoctorError("");

        const response = await getReceptionistDoctors(patientData.department);

        setDoctors(response.data || response.doctors || []);
      } catch (error) {
        console.error("Failed to load doctors:", error);

        setDoctors([]);

        setDoctorError(
          error.response?.data?.message || "Failed to load doctors.",
        );
      } finally {
        setLoadingDoctors(false);
      }
    };

    loadDoctors();
  }, [patientData.department]);

  /*
   * --------------------------------------------------
   * DATE LIMITS
   *
   * Today + next 2 days
   * --------------------------------------------------
   */

  const minAppointmentDate = useMemo(() => {
    return formatDateForInput(new Date());
  }, []);

  const maxAppointmentDate = useMemo(() => {
    const date = new Date();

    date.setDate(date.getDate() + 2);

    return formatDateForInput(date);
  }, []);

  /*
   * --------------------------------------------------
   * SELECTED DOCTOR
   * --------------------------------------------------
   */

  const selectedDoctor = useMemo(() => {
    return doctors.find(
      (doctor) =>
        String(doctor.doctorId || doctor._id) === String(patientData.doctor),
    );
  }, [doctors, patientData.doctor]);

  const selectedDepartment = useMemo(() => {
    return departments.find(
      (department) =>
        String(department.departmentId || department._id) ===
        String(patientData.department),
    );
  }, [departments, patientData.department]);

  /*
   * --------------------------------------------------
   * TIME SLOTS
   * --------------------------------------------------
   */

  const consultationDuration =
    Number(
      selectedDoctor?.consultationDuration ||
        selectedDepartment?.consultationDuration,
    ) || 15;

  const timeSlots = useMemo(() => {
    const allSlots = createTimeSlots(consultationDuration);

    // No doctor/date selected yet
    if (!patientData.doctor || !patientData.appointmentDate) {
      return allSlots;
    }

    const selectedDoctorId = String(patientData.doctor);

    return allSlots.filter((slot) => {
      const slotStart = new Date(
        `${patientData.appointmentDate}T${String(
          Math.floor(slot.startMinutes / 60),
        ).padStart(2, "0")}:${String(slot.startMinutes % 60).padStart(
          2,
          "0",
        )}:00`,
      );

      const slotEnd = new Date(
        `${patientData.appointmentDate}T${String(
          Math.floor(slot.endMinutes / 60),
        ).padStart(2, "0")}:${String(slot.endMinutes % 60).padStart(
          2,
          "0",
        )}:00`,
      );

      const isBooked = bookedAppointments.some((appointment) => {
        const appointmentDoctor =
          appointment.doctor?._id ||
          appointment.doctor?.doctorId ||
          appointment.doctor;

        if (String(appointmentDoctor) !== selectedDoctorId) {
          return false;
        }

        if (["Cancelled", "No Show"].includes(appointment.status)) {
          return false;
        }

        const appointmentStart = new Date(appointment.appointmentStart);

        const appointmentEnd = new Date(appointment.appointmentEnd);

        if (
          Number.isNaN(appointmentStart.getTime()) ||
          Number.isNaN(appointmentEnd.getTime())
        ) {
          return false;
        }

        // Time-overlap check
        return slotStart < appointmentEnd && slotEnd > appointmentStart;
      });

      return !isBooked;
    });
  }, [
    consultationDuration,
    bookedAppointments,
    patientData.doctor,
    patientData.appointmentDate,
  ]);

  /*
   * --------------------------------------------------
   * HANDLE INPUT CHANGE
   * --------------------------------------------------
   */

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "department") {
      setPatientData((currentData) => ({
        ...currentData,
        department: value,
        doctor: "",
        appointmentTime: "",
      }));

      return;
    }

    if (name === "doctor") {
      setPatientData((currentData) => ({
        ...currentData,
        doctor: value,
        appointmentTime: "",
      }));

      return;
    }

    if (name === "appointmentDate") {
      setPatientData((currentData) => ({
        ...currentData,
        appointmentDate: value,
        appointmentTime: "",
      }));

      return;
    }

    setPatientData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  /*
   * --------------------------------------------------
   * SUBMIT
   * --------------------------------------------------
   */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!patientData.department) {
      alert("Please select a department.");
      return;
    }

    if (!patientData.doctor) {
      alert("Please select a doctor.");
      return;
    }

    if (!patientData.appointmentDate) {
      alert("Please select an appointment date.");
      return;
    }

    if (!patientData.appointmentTime) {
      alert("Please select an appointment time.");
      return;
    }

    const selectedSlot = timeSlots.find(
      (slot) => slot.value === patientData.appointmentTime,
    );

    if (!selectedSlot) {
      alert("Please select a valid appointment slot.");
      return;
    }

    // ==========================================
    // Convert selected slot into Date objects
    // ==========================================

    const appointmentStart = new Date(
      `${patientData.appointmentDate}T${String(
        Math.floor(selectedSlot.startMinutes / 60),
      ).padStart(2, "0")}:${String(selectedSlot.startMinutes % 60).padStart(
        2,
        "0",
      )}:00`,
    );

    const appointmentEnd = new Date(
      `${patientData.appointmentDate}T${String(
        Math.floor(selectedSlot.endMinutes / 60),
      ).padStart(2, "0")}:${String(selectedSlot.endMinutes % 60).padStart(
        2,
        "0",
      )}:00`,
    );

    // ==========================================
    // Prepare registration data
    // ==========================================

    const registrationData = {
      ...(existingPatient ? { existingPatientId: existingPatient._id, patientId: existingPatient.patientId, patient: existingPatient._id } : {}),
      fullName: `${patientData.firstName} ${patientData.lastName}`.trim(),

      email: patientData.email,

      phone: patientData.phone,

      gender: patientData.gender,

      dateOfBirth: patientData.dob,

      bloodGroup: patientData.bloodGroup,

      address: patientData.address || "",

      emergencyContact: patientData.emergencyContact || null,

      allergies: patientData.allergies || [],

      chronicDiseases: patientData.chronicDiseases || [],

      insurance: patientData.insurance || null,

      doctor: patientData.doctor,

      department: patientData.department,

      appointmentStart: appointmentStart.toISOString(),

      appointmentEnd: appointmentEnd.toISOString(),

      reason: "Walk-in Consultation",

      symptoms: patientData.symptoms ? [patientData.symptoms] : [],

      consultationDuration,
    };

    // ==========================================
    // IMPORTANT:
    // Call onRegister ONLY ONCE
    // ==========================================

    try {
      await onRegister?.(registrationData);

      // Only reset after successful registration
      setPatientData(getInitialData());
      if (onClearExistingPatient) onClearExistingPatient();
    } catch (error) {
      console.error("Registration failed:", error);

      // Do NOT reset form if registration fails
    }
  };

  /*
   * --------------------------------------------------
   * FORM FIELDS
   * --------------------------------------------------
   */

  const registrationFields = [...fields, ...additionalFields];

  /*
   * --------------------------------------------------
   * LOAD BOOKED APPOINTMENTS
   * --------------------------------------------------
   *
   * When doctor + date are selected, fetch appointments
   * for that date and use them to hide already-booked slots.
   */

  useEffect(() => {
    if (!patientData.doctor || !patientData.appointmentDate) {
      setBookedAppointments([]);
      setAppointmentError("");
      return;
    }

    const loadBookedAppointments = async () => {
      try {
        setLoadingBookedSlots(true);
        setAppointmentError("");

        const response = await getTodayAppointments({
          page: 1,
          limit: 100,
          date: patientData.appointmentDate,
        });

        const appointments =
          response?.appointments ||
          response?.data?.appointments ||
          response?.data ||
          [];

        setBookedAppointments(Array.isArray(appointments) ? appointments : []);
      } catch (error) {
        console.error("Failed to load booked appointments:", error);

        setBookedAppointments([]);

        setAppointmentError(
          error.response?.data?.message ||
            "Failed to load appointment availability.",
        );
      } finally {
        setLoadingBookedSlots(false);
      }
    };

    loadBookedAppointments();
  }, [patientData.doctor, patientData.appointmentDate]);

  return (
    <section className="rc-registration-section">
      <div className="rc-section-heading rc-title-with-icon">
        <h2>{existingPatient ? `Book Appointment for ${existingPatient.fullName}` : title}</h2>

        <span aria-label="Patient information">ⓘ</span>
      </div>

      <Card className="rc-registration-card">
        {existingPatient && (
          <div style={{
            background: "#e8f5e9",
            border: "1px solid #a5d6a7",
            borderRadius: "8px",
            padding: "12px 16px",
            margin: "16px 24px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#1b5e20"
          }}>
            <div>
              <strong>Booking for Existing Patient:</strong> {existingPatient.fullName} ({existingPatient.patientId}) - Phone: {existingPatient.phone}
            </div>
            {onClearExistingPatient && (
              <Button type="button" onClick={onClearExistingPatient} style={{ padding: "4px 8px", fontSize: "12px" }}>
                Switch to New Patient
              </Button>
            )}
          </div>
        )}
        <AppointmentForm
          className="rc-registration-form"
          onSubmit={handleSubmit}
        >
          <div className="rc-form-grid">
            {registrationFields.map(({ options, ...field }) => (
              <Input
                {...field}
                className="rc-form-field"
                key={field.name}
                value={patientData[field.name] || ""}
                onChange={handleChange}
                disabled={Boolean(existingPatient)}
                readOnly={Boolean(existingPatient)}
              >
                {options && (
                  <>
                    <option value="">Select {field.label}</option>

                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </>
                )}
              </Input>
            ))}

            {/* -------------------------------- */}
            {/* DEPARTMENT */}
            {/* -------------------------------- */}

            <Input
              as="select"
              className="rc-form-field"
              label="Select Department"
              name="department"
              value={patientData.department}
              onChange={handleChange}
              required
            >
              <option value="">
                {loadingDepartments
                  ? "Loading departments..."
                  : "Select Department"}
              </option>

              {departments.map((department) => (
                <option
                  key={department.departmentId || department._id}
                  value={department.departmentId || department._id}
                >
                  {department.name}
                </option>
              ))}
            </Input>

            {/* -------------------------------- */}
            {/* DOCTOR */}
            {/* -------------------------------- */}

            <Input
              as="select"
              className="rc-form-field"
              label="Select Doctor"
              name="doctor"
              value={patientData.doctor}
              onChange={handleChange}
              required
              disabled={!patientData.department || loadingDoctors}
            >
              <option value="">
                {!patientData.department
                  ? "Select department first"
                  : loadingDoctors
                    ? "Loading doctors..."
                    : doctors.length === 0
                      ? "No doctors available"
                      : "Select Doctor"}
              </option>

              {doctors.map((doctor) => (
                <option
                  key={doctor.doctorId || doctor._id}
                  value={doctor.doctorId || doctor._id}
                >
                  {doctor.name}
                  {doctor.specialization ? ` - ${doctor.specialization}` : ""}
                </option>
              ))}
            </Input>

            {/* -------------------------------- */}
            {/* APPOINTMENT DATE */}
            {/* -------------------------------- */}

            <Input
              type="date"
              className="rc-form-field"
              label="Appointment Date"
              name="appointmentDate"
              min={minAppointmentDate}
              max={maxAppointmentDate}
              value={patientData.appointmentDate}
              onChange={handleChange}
              required
            />

            {/* -------------------------------- */}
            {/* APPOINTMENT TIME */}
            {/* -------------------------------- */}

            <Input
              as="select"
              className="rc-form-field"
              label="Appointment Time"
              name="appointmentTime"
              value={patientData.appointmentTime}
              onChange={handleChange}
              disabled={
                !patientData.doctor ||
                !patientData.appointmentDate ||
                loadingBookedSlots
              }
              required
            >
              <option value="">
                {!patientData.doctor
                  ? "Select doctor first"
                  : !patientData.appointmentDate
                    ? "Select date first"
                    : loadingBookedSlots
                      ? "Checking availability..."
                      : timeSlots.length === 0
                        ? "No available slots"
                        : `Select time (${consultationDuration} min)`}
              </option>

              {timeSlots.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </Input>
          </div>

          {/* -------------------------------- */}
          {/* SYMPTOMS */}
          {/* -------------------------------- */}

          <Input
            as="textarea"
            className="rc-form-field"
            label="Brief Description of Symptoms"
            name="symptoms"
            placeholder="Describe the patient's symptoms"
            required
            rows="4"
            value={patientData.symptoms}
            onChange={handleChange}
          />

          {departmentError && (
            <p className="rc-form-error">{departmentError}</p>
          )}

          {doctorError && <p className="rc-form-error">{doctorError}</p>}

          {appointmentError && (
            <p className="rc-form-error">{appointmentError}</p>
          )}

          {/* -------------------------------- */}
          {/* CONSULTATION INFO */}
          {/* -------------------------------- */}

          {selectedDoctor && (
            <p className="rc-form-help">
              Consultation duration:{" "}
              <strong>{consultationDuration} minutes</strong>
            </p>
          )}

          <Button className="rc-form-submit" type="submit">
            {submitLabel}
          </Button>
        </AppointmentForm>
      </Card>
    </section>
  );
}

export default PatientRegistration;
