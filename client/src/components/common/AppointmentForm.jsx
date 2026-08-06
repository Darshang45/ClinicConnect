import React from "react";

export function AppointmentForm({
  mode = "book",
  formData = {},
  handleChange,
  departments = [],
  doctors = [],
  slots = [],
  loadingDepartments = false,
  loadingDoctors = false,
  loadingSlots = false,
  isSubmitting = false,
  isAuthenticated = false,
  onSubmit,
  doctorName = "",
  departmentName = "",
  submitButtonText = "Request Appointment",
}) {
  const isReschedule = mode === "reschedule";

  return (
    <form className="appointment-form" onSubmit={onSubmit}>
      {!isAuthenticated && !isReschedule && (
        <>
          <div className="form-group">
            <label>Full Patient Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName || ""}
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
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
          </div>
        </>
      )}

      <div className="form-group">
        <label>Select Department</label>
        {isReschedule ? (
          <input
            type="text"
            value={departmentName || "Department"}
            disabled
            readOnly
            style={{ opacity: 0.8, cursor: "not-allowed" }}
          />
        ) : (
          <select
            name="departmentId"
            value={formData.departmentId || ""}
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
        )}
      </div>

      <div className="form-group">
        <label>Select Doctor</label>
        {isReschedule ? (
          <input
            type="text"
            value={doctorName || "Doctor"}
            disabled
            readOnly
            style={{ opacity: 0.8, cursor: "not-allowed" }}
          />
        ) : (
          <select
            name="doctorId"
            value={formData.doctorId || ""}
            onChange={handleChange}
            disabled={loadingDoctors || !formData.departmentId}
            required
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.user?.fullName || doctor.fullName}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="form-group">
        <label>Preferred Date</label>
        <input
          type="date"
          name="appointmentDate"
          value={formData.appointmentDate || ""}
          onChange={handleChange}
          min={new Date().toISOString().split("T")[0]}
          required
        />
      </div>

      <div className="form-group">
        <label>Preferred Time</label>
        <select
          name="appointmentTime"
          value={formData.appointmentTime || ""}
          onChange={handleChange}
          disabled={loadingSlots || (!isReschedule && (!formData.doctorId || !formData.appointmentDate))}
          required
        >
          <option value="">
            {loadingSlots ? "Loading slots..." : "Select Time"}
          </option>
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
          value={formData.consultationType || "Offline"}
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
          value={formData.reason || ""}
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
          value={
            Array.isArray(formData.symptoms)
              ? formData.symptoms.join(", ")
              : formData.symptoms || ""
          }
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
          {isSubmitting ? "Processing..." : submitButtonText}
        </button>
      </div>
    </form>
  );
}

export default AppointmentForm;
