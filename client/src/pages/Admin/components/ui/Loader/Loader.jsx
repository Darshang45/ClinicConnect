import React from "react";

function Loader({ text = "Loading data..." }) {
  return (
    <div className="admin-loader-container">
      <div className="spinner-erp"></div>
      <p className="loader-text">{text}</p>
    </div>
  );
}

export default Loader;
