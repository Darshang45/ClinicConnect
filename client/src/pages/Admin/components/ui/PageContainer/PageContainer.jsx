import React from "react";

function PageContainer({ children, className = "" }) {
  return (
    <div className={`container-fluid admin-page-container staff-management-page ${className}`.trim()}>
      {children}
    </div>
  );
}

export default PageContainer;
