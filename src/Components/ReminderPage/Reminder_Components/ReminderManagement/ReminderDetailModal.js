import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const ReminderDetailsModal = ({ show, handleClose, reminder, onSave }) => {
  const [editedReminder, setEditedReminder] = useState({
    eventName: reminder?.eventName || "",
    eventTime: reminder?.eventTime || "",
    eventInfo: reminder?.eventInfo || "",
  });

  const handleSaveChanges = () => {
    // You can perform validation or other operations before saving
    onSave(editedReminder);
  };

  return (
    <>
    {/* <IconButton>
        <ExitToAppIcon className="text-primary" onClick={handleShow} />
      </IconButton> */}
   
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Reminder Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label htmlFor="editTitle" className="col-form-label">
          Edit reminder title:
        </label>
        <input
          className="form-control"
          id="editTitle"
          value={editedReminder.eventName}
          onChange={(e) =>
            setEditedReminder({ ...editedReminder, eventName: e.target.value })
          }
        />
        <label htmlFor="editTime" className="col-form-label">
          Edit notification time:
        </label>
        <input
          className="form-control"
          type="datetime-local"
          id="editTime"
          value={editedReminder.eventTime}
          onChange={(e) =>
            setEditedReminder({ ...editedReminder, eventTime: e.target.value })
          }
        />
        <label htmlFor="editInfo" className="col-form-label">
          Edit notification info:
        </label>
        <textarea
          className="form-control"
          style={{ height: "130px" }}
          type="text"
          id="editInfo"
          value={editedReminder.eventInfo}
          onChange={(e) =>
            setEditedReminder({ ...editedReminder, eventInfo: e.target.value })
          }
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
    
     </>
  );
};

export default ReminderDetailsModal;
