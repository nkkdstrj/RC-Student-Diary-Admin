// create reminder
import { Edit } from "@mui/icons-material";
import { getDatabase, ref, serverTimestamp } from 'firebase/database';
import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { app } from '../../../firebase-config';

function EditReminderModal() {
  const [show, setShow] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editReminder, setEditReminder] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

 // editreminder
 const handleEditReminder = (reminder) => {
    setEditReminder(reminder);
    setShowEditModal(true);
  };

  const handleSaveEditedReminder = (editedReminder) => {
    if (editedReminder) {
      const { userId, date, eventName, eventTime, eventInfo,} = editedReminder;
  
      // Assuming the database structure is similar to PublicReminders/{userId}/{date}
      const reminderRef = ref(getDatabase(app), `PublicReminders/${userId}/${date}`);

      // Format the edited date and time to match the format when creating a new reminder
      const editedDate = new Date(eventTime);
      const year = editedDate.getFullYear();
      const month = (editedDate.getMonth() + 1).toString().padStart(2, '0');
      const day = editedDate.getDate().toString().padStart(2, '0');
      const selectedDate = `${year}${month}${day}`;
  
      // Update only the relevant fields that need to be edited
      const updatedReminderData = {
        [selectedDate]: { 
        eventName: eventName,
        eventTime: formatToMilitaryTime(editedDate),
        eventInfo: eventInfo,
        createdTimestamp: serverTimestamp(editedDate), // Include a server timestamp when updating the reminder.
        }
      };

      function formatToMilitaryTime(date) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const formattedHours = hours < 10 ? `0${hours}` : hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes}`;
      }
    
  
      update(reminderRef, updatedReminderData)
        .then(() => {
          // You may want to update the state or perform other actions
          // depending on your use case
  
          // For demonstration, we're just closing the edit modal here
          setShowEditModal(false);
        })
        .catch((error) => {
          console.error("Error updating reminder: ", error);
          // Handle error, e.g., display an error message to the user
        });
    }
  };

  return (
    <>
      {/* <IconButton>
        <ExitToAppIcon className="text-primary" onClick={handleShow} />
      </IconButton> */}
      <Button variant="primary" onClick={handleShow} >Add Reminder <Edit/></Button>

        {/* Edit Reminder Modal */}
        <Modal  className="text-white" show={showEditModal} onHide={() => setShowEditModal(false)} 
        backdrop="static"
        keyboard={false}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
        <Modal.Header closeButton>
        <Modal.Title>Edit Reminder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {/* Simple edit form for demonstration purposes */}
        <label htmlFor="editTitle">Edit reminder title:</label>
        <input
            id="editTitle"
            value={editReminder?.eventName || ''}
            onChange={(e) => setEditReminder({ ...editReminder, eventName: e.target.value })}
        />
        <label htmlFor="editTime">Edit notification time:</label>
        <input
            type="datetime-local"
            id="editTime"
            value={editReminder?.eventTime || ''}
            onChange={(e) => setEditReminder({ ...editReminder, eventTime: e.target.value })}
        />
        <label htmlFor="editInfo">Edit notification info:</label>
        <input
            type="text"
            id="editInfo"
            value={editReminder?.eventInfo || ''}
            onChange={(e) => setEditReminder({ ...editReminder, eventInfo: e.target.value })}
        />
        {/* Add more fields as needed for editing other properties */}
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
        </Button>
        <Button variant="primary" onClick={() => handleSaveEditedReminder(editReminder)}>
            Save Changes
        </Button>
        </Modal.Footer>
        </Modal> 
    </>
  );
}

export default EditReminderModal;


