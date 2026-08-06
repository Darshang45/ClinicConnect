import React from "react";
import Button from "../Button/Button";

function EmptyState({
  title = "No data found",
  description = "There are no records to display at the moment.",
  icon = "folder-x",
  actionText,
  onActionClick,
}) {
  return (
    <div className="admin-empty-state">
      <div className="empty-state-icon-wrapper">
        <i className={`bi bi-${icon}`}></i>
      </div>
      <h5 className="empty-state-title">{title}</h5>
      <p className="empty-state-desc">{description}</p>
      {actionText && onActionClick && (
        <Button variant="primary" onClick={onActionClick}>
          <i className="bi bi-plus-lg me-1"></i> {actionText}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
