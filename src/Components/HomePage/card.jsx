import "bootstrap/dist/css/bootstrap.css";
import React from "react";

const styleCard = {
  backgroundColor:  "#d1efff",
  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  width: "auto",
  borderRadius: '1.25rem 1.25rem 1.25rem 1.25rem'
};

const styleText = {
  color: "black",
  textAlign: "center",
  fontWeight: "950",
};

const numStyle = {
  fontSize: "90px",
};

const Card = ({ link, num, desc }) => {
  return (
    <>
      <div className="card mb-3" style={styleCard}>
        <div className="card-body text-success">
          <a style={{textDecoration:"none"}} href={link}>
          <p className="card-text" style={styleText}>
            <h1 className="fw-bold" style={numStyle}>
              {num}
            </h1>
            <p className="fw-bold">{desc}</p>
          </p></a>
        </div>
      </div>
    </>
  );
};

export default Card;
