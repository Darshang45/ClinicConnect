import { useState, useEffect, useCallback } from "react";
import { getPatientDashboardData } from "../services/patientService";

export function usePatientDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPatientDashboardData();

      if (response?.success && response?.dashboard) {
        const raw = response.dashboard;
        setDashboardData({
          patientName: raw.patientName || "",
          bloodGroup: raw.bloodGroup || "N/A",
          stats: {
            upcomingAppointments: raw.stats?.upcomingAppointments ?? raw.upcomingAppointments ?? 0,
            completedAppointments: raw.stats?.completedAppointments ?? raw.completedAppointments ?? 0,
            cancelledAppointments: raw.stats?.cancelledAppointments ?? raw.cancelledAppointments ?? 0,
            activePrescriptions: raw.stats?.activePrescriptions ?? raw.activePrescriptions ?? 0,
          },
          nextAppointment: raw.nextAppointment || null,
        });
      } else {
        setDashboardData({
          patientName: "",
          bloodGroup: "N/A",
          stats: {
            upcomingAppointments: 0,
            completedAppointments: 0,
            cancelledAppointments: 0,
            activePrescriptions: 0,
          },
          nextAppointment: null,
        });
      }
    } catch (err) {
      console.error("usePatientDashboard error:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to load dashboard.");
      setDashboardData({
        patientName: "",
        bloodGroup: "N/A",
        stats: {
          upcomingAppointments: 0,
          completedAppointments: 0,
          cancelledAppointments: 0,
          activePrescriptions: 0,
        },
        nextAppointment: null,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboardData,
    loading,
    error,
    refetch: fetchDashboard,
  };
}

export default usePatientDashboard;
