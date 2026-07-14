import doctorImage from "../../../assets/images/doctors/doctor-6.jpg";
import "../../../styles/doctor_dashboard.css";

function DashboardHeader() {
  return (
    <header className="doc-dashboard-header">
      <div className="doc-header-content">
        <div className="doc-brand">
          <div className="doc-brand-mark" aria-hidden="true">
            <span className="material-symbols-outlined filled">medical_services</span>
          </div>
          <div>
            <p className="doc-brand-name">Clinic Connect</p>
            <p className="doc-brand-subtitle">Doctor Portal</p>
          </div>
        </div>

        <div className="doc-header-actions">
          <span className="doc-header-divider" aria-hidden="true" />
          <button className="doc-icon-button" type="button" aria-label="Open messages">
            <span className="material-symbols-outlined">chat</span>
          </button>
          <button className="doc-icon-button doc-notification-button" type="button" aria-label="View notifications">
            <span className="material-symbols-outlined">notifications</span>
            <span className="doc-notification-dot" />
          </button>
          <div className="doc-doctor-profile">
            <div className="doc-doctor-details">
              <strong>Dr. Julianne Moore</strong>
              <span>Senior Cardiologist</span>
            </div>
            <img src={doctorImage} alt="Dr. Julianne Moore" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
