import { useEffect, useState } from "react";
import {
  getPublicDepartments,
  getPublicDoctorsByDepartment,
  getAvailableSlots,
  createAppointment,
} from "../../../services/appointmentService";
import { sendPatientOtp } from "../../../services/authService";
import { useAppointmentBooking } from "../../../context/AppointmentBookingContext";
import { useAuth } from "../../../context/AuthContext";
import useAppointmentFlow from "../../../hooks/useAppointmentFlow";
import { useNavigate, useLocation } from "react-router-dom";

import AppointmentForm from "../../../components/common/AppointmentForm";

// Simple form wrapper - used by PatientRegistration.jsx
export function AppointmentFormWrapper({
  children,
  className = "appointment-form",
  onSubmit,
}) {
  return (
    <form className={className} onSubmit={onSubmit}>
      {children}
    </form>
  );
}

function Appointment() {
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user, saveRegistrationSession } = useAuth();
  const { saveAppointment, clearAppointment, pendingAppointment } = useAppointmentBooking();
  const { completePendingAppointment } = useAppointmentFlow();

  const initialBookingState = {
    fullName: isAuthenticated && user ? (user.fullName || user.name || "Patient") : "",
    email: isAuthenticated && user ? (user.email || "") : "",
    departmentId: location.state?.departmentId || "",
    doctorId: location.state?.doctorId || "",
    appointmentDate: "",
    appointmentTime: "",
    consultationType: "Offline",
    reason: "",
    symptoms: "",
  };

  const [formData, setFormData] = useState(initialBookingState);

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [isClosed, setIsClosed] = useState(false);

  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill authenticated user info & prefilled doctor/department state from location
  useEffect(() => {
    if (location.state?.doctorId && location.state?.departmentId) {
      setFormData((prev) => ({
        ...prev,
        departmentId: location.state.departmentId,
        doctorId: location.state.doctorId,
      }));
    } else if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || user.name || "Patient",
        email: user.email || "",
      }));
    } else if (!isAuthenticated && pendingAppointment && Object.values(pendingAppointment).some((val) => val !== "")) {
      setFormData((prev) => ({
        ...prev,
        ...pendingAppointment,
        consultationType: pendingAppointment.consultationType || "Offline",
      }));
    }
  }, [isAuthenticated, user, location.state]);

  // Generic Input Handler
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // Clear dependent fields when department changes manually
      if (name === "departmentId") {
        next.doctorId = "";
        next.appointmentTime = "";
      }
      // Clear time slot when doctor changes manually
      if (name === "doctorId") {
        next.appointmentTime = "";
      }
      return next;
    });
  };

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setLoadingDepartments(true);

        const response = await getPublicDepartments();

        setDepartments(response.departments || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingDepartments(false);
      }
    };

    loadDepartments();
  }, []);

  useEffect(() => {
    if (!formData.departmentId) {
      setDoctors([]);
      return;
    }

    const loadDoctors = async () => {
      try {
        setLoadingDoctors(true);

        const response = await getPublicDoctorsByDepartment(
          formData.departmentId,
        );

        setDoctors(response.doctors || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingDoctors(false);
      }
    };

    loadDoctors();
  }, [formData.departmentId]);

  useEffect(() => {
    if (!formData.doctorId || !formData.appointmentDate) {
      setSlots([]);
      return;
    }

    const loadSlots = async () => {
      try {
        setLoadingSlots(true);

        const response = await getAvailableSlots(
          formData.doctorId,
          formData.appointmentDate,
        );
        
        setSlots(response.slots || []);
        setIsClosed(!!response.isClosed);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingSlots(false);
      }
    };

    loadSlots();
  }, [formData.doctorId, formData.appointmentDate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const finalFullName = isAuthenticated ? (user?.fullName || user?.name || formData.fullName || "Patient") : formData.fullName;
    const finalEmail = isAuthenticated ? (user?.email || formData.email || "") : formData.email;

    if (
      !finalFullName ||
      !finalEmail ||
      !formData.departmentId ||
      !formData.doctorId ||
      !formData.appointmentDate ||
      !formData.appointmentTime ||
      !formData.reason
    ) {
      alert("Please fill all required fields, including Reason for Visit.");
      return;
    }

    const appointmentPayload = {
      ...formData,
      fullName: finalFullName,
      email: finalEmail,
      consultationType: formData.consultationType === "In-Person" ? "Offline" : (formData.consultationType || "Offline"),
    };

    saveAppointment(appointmentPayload);

    if (isAuthenticated) {
      try {
        setIsSubmitting(true);
        await completePendingAppointment(appointmentPayload);
        alert("Appointment booked successfully!");
      } catch (err) {
        console.error("Booking error:", err);
        alert(err?.response?.data?.message || "Failed to book appointment.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await sendPatientOtp(formData.email.trim().toLowerCase());

      if (response.isNewPatient) {
        saveRegistrationSession(
          formData.email.trim().toLowerCase(),
          response.registrationToken
        );
        navigate("/login");
      } else {
        navigate("/login/verify");
      }
    } catch (error) {
      console.error("Error initiating login:", error);
      alert(
        error.response?.data?.message ||
          "Failed to request appointment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const prefilledDeptName =
    location.state?.departmentName ||
    departments.find((d) => d._id === formData.departmentId)?.name ||
    "Department";

  const prefilledDocName =
    location.state?.doctorName ||
    doctors.find((d) => (d._id || d.id || d.doctorId) === formData.doctorId)?.user?.fullName ||
    doctors.find((d) => (d._id || d.id || d.doctorId) === formData.doctorId)?.fullName ||
    doctors.find((d) => (d._id || d.id || d.doctorId) === formData.doctorId)?.name ||
    "Doctor";

  return (
    <section className="appointment" id="book">
      <div className="appointment-inner">
        <div className="appointment-card glass-card">
          <div className="appointment-header">
            <h2>Book Your Consultation</h2>
            <p>Fast, secure, and intuitive appointment scheduling.</p>
          </div>

          <div className="appointment-steps">
            <div className="appointment-step">
              <div className="appointment-step-circle active">1</div>
              <span>Details</span>
            </div>
            <div className="appointment-step-line"></div>
            <div className="appointment-step">
              <div className="appointment-step-circle">2</div>
              <span>Schedule</span>
            </div>
            <div className="appointment-step-line"></div>
            <div className="appointment-step">
              <div className="appointment-step-circle">3</div>
              <span>Confirm</span>
            </div>
          </div>

          <AppointmentForm
            mode="book"
            formData={formData}
            handleChange={handleChange}
            departments={departments}
            doctors={doctors}
            slots={slots}
            isClosed={isClosed}
            loadingDepartments={loadingDepartments}
            loadingDoctors={loadingDoctors}
            loadingSlots={loadingSlots}
            isSubmitting={isSubmitting}
            isAuthenticated={isAuthenticated}
            onSubmit={handleSubmit}
            departmentName={prefilledDeptName}
            doctorName={prefilledDocName}
            submitButtonText="Request Appointment"
            isPrefilled={Boolean(location.state?.isPrefilled || (location.state?.doctorId && location.state?.departmentId))}
          />
        </div>
      </div>
    </section>
  );
}

export default Appointment;
