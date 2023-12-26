// batch upload
import { Edit } from "@mui/icons-material";
import { createUserWithEmailAndPassword, deleteUser, getAuth } from 'firebase/auth';
import { get, getDatabase, ref, remove, set } from 'firebase/database';
import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { app, db } from '../../../firebase-config';

function BatchModal() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [errorMessage, setErrorMessage] = useState('');
  const [userDataArray, setUserDataArray] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const userData = JSON.parse(event.target.result);
          setUserDataArray(userData);
        } catch (error) {
          setErrorMessage(`Error reading JSON file: ${error.message}`);
        }
      };

      reader.readAsText(file);
    }
  };

  const registerUsers = () => {
    const auth = getAuth(app);
    const db = getDatabase(app);

    userDataArray.forEach((userData) => {
      const { FullName, studNum, phoneNum, passWord, uid } = userData;

      // Check if the phone number is valid (11 digits)
      if (!isValidPhoneNumber(phoneNum)) {
        setErrorMessage(`Invalid phone number for ${FullName}. Skipping registration.`);
        return; // Skip registration for this user
      }

      // Check if the phone number is unique
      isPhoneNumberUnique(phoneNum)
        .then((isUnique) => {
          if (isUnique) {
            createUserWithEmailAndPassword(auth, `${studNum}@rc.edu`, passWord)
              .then((userCredential) => {
                // Successfully registered
                const user = userCredential.user;
                const userDataToStore = {
                  FullName,
                  // studentNumber: studNum,
                  PhoneNumber: phoneNum,
                  uid: user.uid, // Save the user's UID from Firebase Authentication
                };

                // Link user's UID in "Users" data
                const studentRef = ref(db, `Users/${studNum}`);
                set(studentRef, userDataToStore);
              })
              .catch((error) => {
                setErrorMessage(`Error registering ${FullName}: ${error.message}`);
              });
          } else {
            setErrorMessage(`Phone number for ${FullName} is already registered. Skipping registration.`);
          }
        });
    });

    setErrorMessage('User registration completed.');
  };

  const deleteData = async () => {
    const auth = getAuth(app);
    const studentsRef = ref(db, 'Users');
    const snapshot = await get(studentsRef);

    if (snapshot.exists()) {
      const studentsData = snapshot.val();

      for (const studentKey in studentsData) {
        const student = studentsData[studentKey];

        if (student.uid) {
          try {
            // Delete user from Firebase Authentication
            await deleteUser(auth, student.uid);
            setErrorMessage(`User with student number ${student.studentNumber} deleted from Authentication.`);
          } catch (error) {
            setErrorMessage(`Error deleting user with student number ${student.studentNumber} from Authentication: ${error.message}`);
          }

          // Delete student data from Realtime Database
          const studentDataRef = ref(db, `Users/${studentKey}`);
          remove(studentDataRef);
          setErrorMessage(`Student data for ${student.studentNumber} deleted from Realtime Database.`);
        }
      }
    }
  };

  const isValidPhoneNumber = (PhoneNumber) => {
    const phoneRegex = /^\d{11}$/;
    return phoneRegex.test(PhoneNumber);
  };

  const isPhoneNumberUnique = (PhoneNumber) => {
    const studentsRef = ref(db, 'Users');
    return get(studentsRef).then((snapshot) => {
      if (snapshot.exists()) {
        const studentsData = snapshot.val();
        for (const studentKey in studentsData) {
          if (studentsData[studentKey].PhoneNumber === PhoneNumber) {
            return false;
          }
        }
      }
      return true;
    });
  };
  return (
    <>
      {/* <IconButton>
        <ExitToAppIcon className="text-primary" onClick={handleShow} />
      </IconButton> */}
      <Button variant="primary" onClick={handleShow} >Add Batch <Edit/></Button>

      <Modal
        className="text-white"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        dialogClassName="custom-modal">
        <Modal.Header closeButton className="d-flex justify-content-center align-items-center"
         style={{
          backgroundColor: "#1e329c",
          border: "none",
          borderRadius: '1.25rem 1.25rem 0 0', // 20px converted to rem
        }}>
          <Modal.Title className="">
                        <h1>Add Batch</h1>
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="text-center"
         style={{
          backgroundColor: "white",
          border: "none",
          color: "grey",
          padding: '0.9375rem 2.5rem 0rem 2.5rem', // 15px and 20px converted to rem
        }}>
        <label>Add JSON file to add batch.</label>
        <input type="file" accept=".json" required onChange={handleFileChange} />
        <button type="button" onClick={registerUsers}>
          Register Users
        </button>
        <button type="button" onClick={deleteData}>
          Delete Data
        </button>
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
          {/* <Button variant="primary" onClick={handleScheduleNotification}>
            Schedule Reminder
          </Button> */}
           <div style={{ color: 'red' }}>{errorMessage}</div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default BatchModal;
