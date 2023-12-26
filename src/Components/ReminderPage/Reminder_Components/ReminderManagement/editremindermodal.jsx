// EditReminderModal.jsx
import { getDatabase, ref, serverTimestamp, update, } from 'firebase/database';
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { app } from '../../../firebase-config';

const EditReminderModal = ({ show, handleClose, reminder, onSave }) => {
  const [editedReminder, setEditedReminder] = useState({
    eventName: reminder?.eventName || '',
    eventTime: reminder?.eventTime || '',
    eventInfo: reminder?.eventInfo || '',
  });

  const handleSaveChanges = () => {
    if (editedReminder) {
      const { userId, date, eventName, eventTime, eventInfo } = reminder;

      const reminderRef = ref(getDatabase(app), `PublicReminders/${userId}/${date}`);
      const editedDate = new Date(editedReminder.eventTime);

      const updatedReminderData = {
        [date]: {
          eventName: editedReminder.eventName,
          eventTime: formatToMilitaryTime(editedDate),
          eventInfo: editedReminder.eventInfo,
          createdTimestamp: serverTimestamp(editedDate),
        },
      };

      update(reminderRef, updatedReminderData)
        .then(() => {
          onSave(editedReminder);
          handleClose();
        })
        .catch((error) => {
          console.error("Error updating reminder: ", error);
          // Handle error, e.g., display an error message to the user
        });
    }
  };

  function formatToMilitaryTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes}`;
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      dialogClassName="custom-modal"
    >
      <Modal.Header
        closeButton
        style={{
          backgroundColor: "#1e329c",
          border: "none",
          borderRadius: "1.25rem 1.25rem 0 0", // 20px converted to rem
        }}
      >
        <Modal.Title>Edit Reminder</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          backgroundColor: "white",
          border: "none",
          color: "grey",
          padding: "0.9375rem 2.5rem 0rem 2.5rem", // 15px and 20px converted to rem
        }}
      >
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
      <Modal.Footer
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
        <Button variant="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditReminderModal;
