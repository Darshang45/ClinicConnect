import { useEffect, useState } from "react";
import {
  getPublicDepartments,
  getPublicDoctorsByDepartment,
  getAvailableSlots,
} from "../../../services/appointmentService";
import { sendPatientOtp } from "../../../services/authService";
import { useAppointmentBooking } from "../../../context/AppointmentBookingContext";
import { useAuth } from "../../../context/AuthContext";
import useAppointmentFlow from "../../../hooks/useAppointmentFlow";
import { useNavigate } from "react-router-dom";

export function AppointmentForm({
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

  const { isAuthenticated, saveRegistrationSession } = useAuth();
  const { saveAppointment, pendingAppointment } = useAppointmentBooking();
  const { completePendingAppointment } = useAppointmentFlow();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    departmentId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    consultationType: "Offline",
    reason: "",
    symptoms: "",
  });

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);

  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Restore saved appointment data if available
  useEffect(() => {
    if (pendingAppointment && Object.values(pendingAppointment).some((val) => val !== "")) {
      setFormData((prev) => ({
        ...prev,
        ...pendingAppointment,
        consultationType: pendingAppointment.consultationType || "Offline",
      }));
    }
  }, [pendingAppointment]);

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
    if (
      !formData.fullName ||
      !formData.email ||
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
      consultationType: formData.consultationType === "In-Person" ? "Offline" : (formData.consultationType || "Offline"),
    };

    saveAppointment(appointmentPayload);

    if (isAuthenticated) {
      try {
        await completePendingAppointment();
      } catch (err) {
        console.error(err);
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

          <AppointmentForm onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Patient Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Select Department</label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                disabled={loadingDepartments}
                required
              >
                <option value="">Select Department</option>

                {departments.map((department) => (
                  <option key={department._id} value={department._id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Select Doctor</label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                disabled={loadingDoctors || !formData.departmentId}
                required
              >
                <option value="">Select Doctor</option>

                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.user.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Preferred Date</label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div className="form-group">
              <label>Preferred Time</label>
              <select
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                disabled={
                  loadingSlots ||
                  !formData.doctorId ||
                  !formData.appointmentDate
                }
                required
              >
                <option value="">Select Time</option>

                {slots.map((slot) => (
                  <option key={slot.start} value={slot.start}>
                    {slot.start} - {slot.end}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Consultation Type</label>
              <select
                name="consultationType"
                value={formData.consultationType}
                onChange={handleChange}
              >
                <option value="Offline">Offline</option>
                <option value="Online">Online</option>
              </select>
            </div>
            <div className="form-group form-group-full">
              <label>Reason for Visit</label>
              <textarea
                rows="2"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Reason for appointment (e.g. Annual Checkup, Consultation)"
                required
              />
            </div>
            <div className="form-group form-group-full">
              <label>Brief Description of Symptoms</label>
              <textarea
                rows="4"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                placeholder="How can we help you today?"
              />
            </div>
            <div className="form-group form-group-full">
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Request Appointment"}
              </button>
            </div>
          </AppointmentForm>
        </div>
      </div>
    </section>
  );
}

export default Appointment;
