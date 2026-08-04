import React from "react";
import Button from "../Button/Button";

function PageHeader({ title, subtitle, actionText, actionIcon, onActionClick, children }) {
  return (
    <div className="admin-page-header">
      <div className="admin-page-heading">
        <h1 className="page-title-heading">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      <div className="admin-page-actions">
        {children}
        {actionText && onActionClick && (
          <Button variant="primary" onClick={onActionClick}>
            {actionIcon && <i className={`bi bi-${actionIcon}`}></i>}
            <span>{actionText}</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
