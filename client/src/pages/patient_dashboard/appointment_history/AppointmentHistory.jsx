import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiFileText,
  FiCheckCircle,
  FiXCircle,
  FiUploadCloud,
  FiRefreshCw,
  FiActivity,
} from "react-icons/fi";
import Card from "../../../components/common/Card";
import { getPatientTimeline } from "../../../services/patientService";
import "../../../styles/patient_dashboard.css";

const EVENT_ICONS = {
  BOOKED: FiCalendar,
  RESCHEDULED: FiRefreshCw,
  CANCELLED: FiXCircle,
  CHECKED_IN: FiClock,
  CONSULTATION_STARTED: FiActivity,
  CONSULTATION_COMPLETED: FiCheckCircle,
  APPOINTMENT_COMPLETED: FiCheckCircle,
  PRESCRIPTION_ISSUED: FiFileText,
  REPORT_UPLOADED: FiUploadCloud,
};

function AppointmentHistory() {
  const [timeline, setTimeline] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchTimeline = async () => {
      try {
        setLoading(true);
        const data = await getPatientTimeline({ page: 1, limit: 10 });
        if (isMounted && data.success) {
          setTimeline(data.timeline || []);
          setTotalPages(data.totalPages || 1);
          setTotalEvents(data.totalEvents || data.timeline?.length || 0);
          setPage(1);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load patient timeline:", err);
          setError("Failed to load medical timeline.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTimeline();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoadMore = async () => {
    if (page >= totalPages || loadingMore) return;
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const data = await getPatientTimeline({ page: nextPage, limit: 10 });
      if (data.success) {
        setTimeline((prev) => [...prev, ...(data.timeline || [])]);
        setPage(nextPage);
        setTotalPages(data.totalPages || nextPage);
        if (data.totalEvents) setTotalEvents(data.totalEvents);
      }
    } catch (err) {
      console.error("Failed to load more timeline items:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <Card className="pd-appointment-history" id="appointment-history">
      <div className="pd-section-heading">
        <h2>Medical Overview &amp; Timeline</h2>
        <div className="pd-history-tabs">
          <span className="is-active">Timeline</span>
        </div>
      </div>

      {loading ? (
        <div className="pd-timeline-loading">Loading timeline...</div>
      ) : error ? (
        <div className="pd-timeline-error">{error}</div>
      ) : timeline.length === 0 ? (
        <div className="pd-timeline-empty">
          <p>No medical history available yet.</p>
          <small>Book your first appointment to start building your medical timeline.</small>
          <a href="#booking" className="pd-timeline-empty-btn">
            Book Appointment
          </a>
        </div>
      ) : (
        <>
          <div className="pd-timeline-container">
            <div className="pd-timeline">
              {timeline.map((item, index) => {
                const Icon = EVENT_ICONS[item.eventType] || FiActivity;
                return (
                  <article
                    className={`pd-timeline-item ${index === 0 ? "is-featured" : ""}`}
                    key={item.id}
                  >
                    <span className="pd-timeline-icon">
                      <Icon />
                    </span>
                    <div className="pd-timeline-content">
                      <div>
                        <small>{item.eventType.replace(/_/g, " ")}</small>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                      <div className="pd-timeline-date">
                        <strong>
                          {item.date} {item.time}
                        </strong>
                        <small>
                          {item.doctor?.name || item.department?.name || "ClinicConnect"}
                        </small>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="pd-timeline-load-more-wrapper">
            <small className="pd-timeline-counter">
              {page >= totalPages
                ? `Showing all ${totalEvents || timeline.length} events`
                : `Showing ${timeline.length} of ${totalEvents} events`}
            </small>
            {page < totalPages && (
              <button
                type="button"
                className="pd-timeline-load-more"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? "⏳ Loading..." : "Load More"}
              </button>
            )}
          </div>
        </>
      )}
    </Card>
  );
}

export default AppointmentHistory;
