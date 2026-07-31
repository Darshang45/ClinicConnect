import { appointments } from "../data/dashboard";
import { Avatar, Badge, Button, Card, Table } from "./common";

const columns = [
  { key: "patient", label: "Patient" },
  { key: "doctor", label: "Doctor" },
  { key: "department", label: "Department" },
  { key: "time", label: "Time" },
  { key: "status", label: "Status" },
];

function RecentAppointments() {
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
                  <p className="patient-id">#{appointment.id}</p>
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
