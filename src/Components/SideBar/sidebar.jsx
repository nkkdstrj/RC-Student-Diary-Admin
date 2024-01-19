import {
  CalendarMonth,
  Description,
  Home,
  Logout,
  Person,
} from "@mui/icons-material";
import StorageIcon from '@mui/icons-material/Storage';
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../App.css";
import RC from "../../Assets/RC.png";

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <nav
        className="sidebar sidebar-offcanvas col-3 p2 row-7"
        style={{ boxShadow: "0 5px 7px 8px rgba(0, 0, 0, 0.3)" }}
        id="sidebar"
      >
        <br />
        <div className="d-flex justify-content-center align-items-center">
          <Link className="" to="/dashboard">
            <img src={RC} alt="logo" style={{ width: 60 }} />
          </Link>
          <h4 className="text-white" style={{ fontWeight: "bold" }}>
            ROGATIONIST COLLEGE
          </h4>
        </div>
        <ul className="nav">
          <br />
          <li className="nav-item menu-items">
            <Link
              to="/dashboard"
              className={`nav-link ${
                activeTab === "dashboard" ? "active" : ""
              }`}
              onClick={() => handleTabClick("dashboard")}
              style={{
                backgroundColor: activeTab === "dashboard" ? "#ffffff" : "transparent",
                color: activeTab === "dashboard" ? "#1e329c" : "#ffffff",
              }}
            >
              <Home style={{ margin: 20, color: activeTab === "dashboard" ? "#1e329c" : "#ffffff" }} />
              Dashboard
            </Link>
          </li>

          <li className="nav-item menu-items">
            <Link
              to="/content"
              className={`nav-link ${activeTab === "content" ? "active" : ""}`}
              onClick={() => handleTabClick("content")}
              style={{
                backgroundColor: activeTab === "content" ? "#ffffff" : "transparent",
                color: activeTab === "content" ? "#1e329c" : "#ffffff",
              }}
            >
              <Description style={{ margin: 20, color: activeTab === "content" ? "#1e329c" : "#ffffff" }} />
              Content
            </Link>
          </li>

          <li className="nav-item menu-items">
            <Link
              to="/reminder"
              className={`nav-link ${activeTab === "reminder" ? "active" : ""}`}
              onClick={() => handleTabClick("reminder")}
              style={{
                backgroundColor: activeTab === "reminder" ? "#ffffff" : "transparent",
                color: activeTab === "reminder" ? "#1e329c" : "#ffffff",
              }}
            >
              <CalendarMonth style={{ margin: 20, color: activeTab === "reminder" ? "#1e329c" : "#ffffff" }} />
              Reminders
            </Link>
          </li>

          <li className="nav-item menu-items">
            <Link
              to="/student/manager"
              className={`nav-link ${
                activeTab === "studentManager" ? "active" : ""
              }`}
              onClick={() => handleTabClick("studentManager")}
              style={{
                backgroundColor: activeTab === "studentManager" ? "#ffffff" : "transparent",
                color: activeTab === "studentManager" ? "#1e329c" : "#ffffff",
              }}
            >
              <Person style={{ margin: 20, color: activeTab === "studentManager" ? "#1e329c" : "#ffffff" }} />
              Students Manager
            </Link>
          </li>

          <li className="nav-item menu-items">
            <Link to="/file"
              className={`nav-link ${
                activeTab === "file" ? "active" : ""
              }`}
              onClick={() => handleTabClick("file")}
              style={{
                backgroundColor: activeTab === "file" ? "#ffffff" : "transparent",
                color: activeTab === "file" ? "#1e329c" : "#ffffff",
              }}>
              <StorageIcon  style={{ margin: 20, color: activeTab === "file" ? "#1e329c" : "#ffffff" }} />
              File
            </Link>
          </li>

          <li className="nav-item menu-items">
            <Link className="nav-link"  onClick={handleShow}>
              <Logout style={{ margin: 20, color: "#ffffff" }} />
              Signout
            </Link>
          </li>
        </ul>
      </nav>

      {/* signout modal */}
      <Modal
        className="text-white"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        dialogClassName="custom-modal"
      >
        <Modal.Header
          className="d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "#1e329c",
            border: "none",
            borderRadius: "1.25rem 1.25rem 0 0", // 20px converted to rem
          }}
        >
          <Modal.Title className="">
            <h1>Sign Out?</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="text-center"
          style={{
            backgroundColor: "white",
            border: "none",
            color: "grey",
            padding: "0.9375rem 2.5rem 0rem 2.5rem", // 15px and 20px converted to rem
          }}
        >
          <h3>Do you want to sign out?</h3>
        </Modal.Body>
        <Modal.Footer
          className="text-center"
          style={{
            backgroundColor: "white",
            border: "none",
            borderRadius: "0 0 1.25rem 1.25rem",
            paddingTop: "0rem", // 20px converted to rem
          }}
        >
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Link to={"/"}>
            <Button variant="danger">Sign Out</Button>
          </Link>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Sidebar;