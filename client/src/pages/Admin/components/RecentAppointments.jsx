import { useEffect, useState } from "react";
import { getRecentAppointments } from "../../../services/adminService";
import { Avatar, Badge, Button, Card, Table } from "./common";

const columns = [
  { key: "patient", label: "Patient" },
  { key: "doctor", label: "Doctor" },
  { key: "department", label: "Department" },
  { key: "time", label: "Time" },
  { key: "status", label: "Status" },
];

function RecentAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getStatusTone = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "success";

      case "cancelled":
        return "danger";

      case "checked-in  ":
        return "primary";

      case "pending":
        return "warning";

      default:
        return "neutral";
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getRecentAppointments();

        const mappedAppointments = response.appointments.map((appointment) => ({
          id: appointment.appointmentId, // React key (unique)

          tokenNumber: appointment.tokenNumber, // Display in UI

          patient: appointment.patient || "N/A",

          doctor: appointment.doctor || "N/A",

          department: appointment.department || "N/A",

          time: new Date(appointment.appointmentTime).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),

          status: appointment.status,

          initials: getInitials(appointment.patient),

          avatarTone: "blue",

          statusTone: getStatusTone(appointment.status),
        }));
        setAppointments(mappedAppointments);
      } catch (err) {
        console.error(err);
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <Card className="table-card">
        <p>Loading recent appointments...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="table-card">
        <p>{error}</p>
      </Card>
    );
  }
  return (
    <Card className="table-card" padded={false}>
      <div className="table-header">
        <h4>Recent Appointments</h4>
        <Button variant="secondary">View All</Button>
      </div>
      <Table
        columns={columns}
        data={appointments}
        renderRow={(appointment) => (
          <>
            <td>
              <div className="patient-cell">
                <Avatar
                  className={`patient-avatar ${appointment.avatarTone}`}
                  initials={appointment.initials}
                  size={32}
                />
                <div>
                  <p>
                    <strong>{appointment.patient}</strong>
                  </p>
                  <p className="patient-id">Token #{appointment.tokenNumber}</p>
                </div>
              </div>
            </td>
            <td>{appointment.doctor}</td>
            <td>{appointment.department}</td>
            <td>{appointment.time}</td>
            <td>
              <Badge tone={appointment.statusTone}>{appointment.status}</Badge>
            </td>
          </>
        )}
      />
    </Card>
  );
}

export default RecentAppointments;
