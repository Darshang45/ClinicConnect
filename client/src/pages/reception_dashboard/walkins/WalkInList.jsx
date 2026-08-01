import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import "../../../styles/reception_dashboard.css";
import initialWalkIns from "../data/walkins";

export function WalkInCard({ walkIn }) {
  return (
    <article className="rc-walkin-card">
      <div className="rc-walkin-person">
        <div className="rc-priority-badge">
          <span>Priority</span>
          <strong className={walkIn.priority.toLowerCase()}>{walkIn.priority}</strong>
        </div>
        <div>
          <h3>{walkIn.patient}</h3>
          <p>{walkIn.reason} • {walkIn.waitTime}</p>
        </div>
      </div>
      <div className="rc-walkin-action">
        <span>{walkIn.doctor}</span>
        <Button className={`rc-small-action ${walkIn.actionStyle}`}>{walkIn.action}</Button>
      </div>
    </article>
  );
}

function WalkInList({ walkIns = initialWalkIns }) {
  return (
    <section className="rc-walkin-section">
      <div className="rc-section-heading">
        <h2>Live Walk-in List</h2>
        <span className="rc-count-badge">{walkIns.length} Current Walk-ins</span>
      </div>
      <Card className="rc-walkin-list">
        {walkIns.map((walkIn) => <WalkInCard walkIn={walkIn} key={walkIn.patient} />)}
      </Card>
    </section>
  );
}

export default WalkInList;
