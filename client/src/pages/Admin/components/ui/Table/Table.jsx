import React from "react";

function Table({ headers = [], children, className = "" }) {
  return (
    <div className="table-responsive staff-table-responsive">
      <table className={`admin-table staff-table align-middle ${className}`.trim()}>
        {headers.length > 0 && (
          <thead>
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} className={header.className || ""}>
                  {header.label || header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export default Table;
