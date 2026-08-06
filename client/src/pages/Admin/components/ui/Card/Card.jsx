import React from "react";

export function CardHeader({ children, className = "" }) {
  return <div className={`card-header staff-card-header ${className}`}>{children}</div>;
}

export function CardBody({ children, className = "" }) {
  return <div className={`card-body staff-card-body ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return <div className={`card-footer staff-card-footer ${className}`}>{children}</div>;
}

function Card({ title, subtitle, headerAction, children, className = "" }) {
  return (
    <div className={`card staff-ui-card ${className}`}>
      {(title || headerAction) && (
        <div className="card-header staff-card-header">
          <div>
            {title && <h5 className="card-title">{title}</h5>}
            {subtitle && <p className="text-muted small mb-0 mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export default Card;
