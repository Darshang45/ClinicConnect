import { analyticsCards } from "../data/dashboard";
import { Card } from "./common";

function StatsCards() {
  return (
    <section
      className="analytics-grid full-span"
      aria-label="Dashboard analytics"
    >
      {analyticsCards.map((card) => (
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
