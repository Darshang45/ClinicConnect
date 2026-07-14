import { FiBell } from "react-icons/fi";
import Card from "../../../components/common/Card";
import { notifications } from "../data/notifications";
import "../../../styles/patient_dashboard.css";

function Notifications() { return <Card className="pd-notification-panel" id="notifications"><div className="pd-section-heading"><h2>Notifications</h2><a href="#notifications">Mark all as read</a></div><div className="pd-notification-list">{notifications.map((notification) => <article className="pd-notification-item" key={notification.id}><span><FiBell /></span><div><h3>{notification.title}</h3><p>{notification.description}</p></div><time>{notification.time}</time></article>)}</div></Card>; }

export default Notifications;
