import React from "react";

function Footer() {
  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#f1f2f6",
        minHeight: "80px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p
        style={{
          fontSize: "1.2rem",
          fontWeight: "600",
          color: "#747d8c",
        }}
      >
        Have a nice day!
      </p>
    </div>
  );
}

export default Footer;
