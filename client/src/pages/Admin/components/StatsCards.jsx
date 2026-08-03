import { useEffect, useState } from "react";
import { getDashboardStats } from "../../../services/adminService";
import { Card } from "./common";

function StatsCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboardStats();

        const dashboard = response.dashboard;

        const mappedCards = [
          {
            id: "doctors",
            title: "Doctors",
            value: dashboard.totalDoctors,
            icon: "stethoscope",
            iconTone: "blue",
            valueTone: "primary",
            trend: {
              direction: "neutral",
              label: "Registered",
              icon: "",
            },
          },
          {
            id: "patients",
            title: "Patients",
            value: dashboard.totalPatients,
            icon: "groups",
            iconTone: "green",
            valueTone: "success",
            trend: {
              direction: "neutral",
              label: "Registered",
              icon: "",
            },
          },
          {
            id: "receptionists",
            title: "Receptionists",
            value: dashboard.totalReceptionists,
            icon: "support_agent",
            iconTone: "orange",
            valueTone: "warning",
            trend: {
              direction: "neutral",
              label: "Active",
              icon: "",
            },
          },
          {
            id: "pharmacists",
            title: "Pharmacists",
            value: dashboard.totalPharmacists,
            icon: "medication",
            iconTone: "purple",
            valueTone: "primary",
            trend: {
              direction: "neutral",
              label: "Active",
              icon: "",
            },
          },
          {
            id: "departments",
            title: "Departments",
            value: dashboard.activeDepartments,
            icon: "apartment",
            iconTone: "cyan",
            valueTone: "primary",
            trend: {
              direction: "neutral",
              label: "Active",
              icon: "",
            },
          },
          {
            id: "appointments",
            title: "Today's Appointments",
            value: dashboard.todayAppointments,
            icon: "event",
            iconTone: "red",
            valueTone: "danger",
            trend: {
              direction: "neutral",
              label: "Today",
              icon: "",
            },
          },
          {
            id: "completedAppointments",
            title: "Completed Appointments",
            value: dashboard.completedAppointments,
            icon: "event",
            iconTone: "red",
            valueTone: "primary",
            trend: {
              direction: "neutral",
              label: "Today",
              icon: "",
            },
          },
          {
            id: "cancelledAppointments",
            title: "Cancelled Appointments",
            value: dashboard.cancelledAppointments,
            icon: "event",
            iconTone: "red",
            valueTone: "danger",
            trend: {
              direction: "neutral",
              label: "Today",
              icon: "",
            },
          },
        ];

        setCards(mappedCards);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <section className="analytics-grid full-span">
        <p>Loading dashboard...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="analytics-grid full-span">
        <p>{error}</p>
      </section>
    );
  }

  return (
    <section
      className="analytics-grid full-span"
      aria-label="Dashboard analytics"
    >
      {cards.map((card) => (
        <Card className="analytics-card" key={card.id} padded={false}>
          <div className="analytics-card-top">
            <div
              className={`analytics-icon ${card.iconTone}`}
              aria-hidden="true"
            >
              <span className="material-symbols-outlined">{card.icon}</span>
            </div>
            <span className={`trend ${card.trend.direction}`}>
              {card.trend.icon && (
                <span className="material-symbols-outlined">
                  {card.trend.icon}
                </span>
              )}
              {card.trend.label}
            </span>
          </div>
          <p>{card.title}</p>
          <h3 className={card.valueTone}>{card.value}</h3>
        </Card>
      ))}
    </section>
  );
}

export default StatsCards;
