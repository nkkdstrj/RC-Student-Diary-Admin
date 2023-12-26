// create reminder
import { Edit } from "@mui/icons-material";
import { getDatabase, push, ref, serverTimestamp } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from 'react-router-dom';
import { app, auth, onAuthStateChanged } from '../../../../firebase-config';

function ReminderModal() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationTime, setNotificationTime] = useState('');
  const [notificationInfo, setNotificationInfo] = useState('');
  const [notificationDeleteTime, setNotificationDeleteTime] = useState(''); // new state variable to store the delete time of the reminder
//Protect
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const navigate = useNavigate();

  const smallButtonStyle = {
    fontSize: "15px",
  };

  const handleScheduleNotification = async () => {

    const date = new Date(notificationTime);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const selectedDate = `${year}${month}${day}`;

    const remindersRef = ref(getDatabase(app), 'PublicReminders');
    const newReminderData = {
      [selectedDate]: {
        eventName: notificationTitle,
        eventTime: formatToMilitaryTime(date),
        eventInfo: notificationInfo,
        deleteTime: notificationDeleteTime, // Add the delete time to the reminder data
        createdTimestamp: serverTimestamp(date), // Include a server timestamp when creating the reminder.
      },
    };

    push(remindersRef, newReminderData); // Use "push" to automatically generate a new ID.

    console.log(`Admin Website Notified: ${notificationTitle}`);

    setNotificationTitle('');
    setNotificationTime('');
    setNotificationInfo('');
    setNotificationDeleteTime('');
  };

  function formatToMilitaryTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes}`;
  }

  //Protection
  useEffect(() => {
    // Check the user's authentication status
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUserAuthenticated(true);
      } else {
        // User is signed out
        setUserAuthenticated(false);
        // Redirect to the login page if the user is not authenticated
        navigate('/');
      }
    });

    return () => {
      // Unsubscribe from the authentication observer when the component unmounts
      unsubscribe();
    };
  }, [navigate]);

  if (!userAuthenticated) {
    return null; // Return nothing if the user is not authenticated
  }

  return (
    <>
      {/* <IconButton>
        <ExitToAppIcon className="text-primary" onClick={handleShow} />
      </IconButton> */}
      <Button variant="primary"
          style={{
            borderRadius: "0.4rem",
            border: "none",
            padding: "1rem",
            className:"justify-content-start"
          }}
          onClick={handleShow}> Add Reminder
          <Edit
          style={{
            fontSize: "1rem",
            marginLeft:"0.5rem"
          }}/></Button>

      <Modal
        className="text-white"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        style={{ backgroundColor: 'rgba(255,255,255,0)' }}
        dialogClassName="custom-modal">

        <Modal.Header closeButton className="d-flex justify-content-center align-items-center"
          style={{
          backgroundColor: "#1e329c",
          border: "none",
          borderRadius: '1.25rem 1.25rem 0 0', // 20px converted to rem
        }}
        >
          <Modal.Title className="">
                        <h1>Schedule Reminder</h1>
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="text-left" 
            style={{
              backgroundColor: "white",
              border: "none",
              color: "grey",
              padding: '0.9375rem 2.5rem 0rem 2.5rem', // 15px and 20px converted to rem
            }}>
        <label htmlFor="notificationTitle" class="col-form-label">Enter reminder title:</label>
          <textarea
          class="form-control"
            id="notificationTitle"
            placeholder="Enter your reminder title"
            value={notificationTitle}
            onChange={(e) => setNotificationTitle(e.target.value)}
          />
          <label htmlFor="notificationTime">Select notification time:</label>
          <input
          class="form-control"
            type="datetime-local"
            id="notificationTime"
            value={notificationTime}
            onChange={(e) => setNotificationTime(e.target.value)}
          />     
          <label htmlFor="notificationInfo">Description:</label>
          <textarea
          class="form-control"
          style={{ height: "130px"}}
            id="notificationInfo"
            placeholder="Enter your reminder message"
            value={notificationInfo}
            onChange={(e) => setNotificationInfo(e.target.value)}
          />
        </Modal.Body>

        <Modal.Footer className="text-center"
          style={{
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '0 0 1.25rem 1.25rem', paddingTop: '0rem' // 20px converted to rem
          }}>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleScheduleNotification}>
            Schedule Reminder
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ReminderModal;
