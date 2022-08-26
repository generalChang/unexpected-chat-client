import React from "react";
import { withRouter } from "react-router-dom";

function IconBtn({ title, IconComponent }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <IconComponent
        style={{
          fontSize: "1.2rem",
          marginRight: "0.5rem",
        }}
      />
      <span>{title}</span>
    </div>
  );
}

export default withRouter(IconBtn);
