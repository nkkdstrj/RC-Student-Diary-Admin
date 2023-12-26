// batch upload
import { Edit } from "@mui/icons-material";
import { createUserWithEmailAndPassword, deleteUser, getAuth } from 'firebase/auth';
import { get, getDatabase, ref, remove, set } from 'firebase/database';
import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { app, db } from '../../../../firebase-config';
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
      const { FullName, studNum, EmailAddress, phoneNum, passWord, uid } = userData;

      // Check if the phone number is valid (11 digits)
      if (!isValidPhoneNumber(phoneNum)) {
        setErrorMessage(`Invalid phone number for ${FullName}. Skipping registration.`);
        return; // Skip registration for this user
      }

      // Check if the phone number is unique
      isPhoneNumberUnique(phoneNum)
        .then((isUnique) => {
          if (isUnique) {
            createUserWithEmailAndPassword(auth, EmailAddress, passWord)
              .then((userCredential) => {
                // Successfully registered
                const user = userCredential.user;
                const userDataToStore = {
                  FullName,
                  StudentNumber: studNum,
                  EmailAddress: EmailAddress,
                  PhoneNumber: phoneNum,
                  uid: user.uid, // Save the user's UID from Firebase Authentication
                };

                // Link user's UID in "Users" data //input to which is the primary key
                const studentRef = ref(db, `Users/${user.uid}`);
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
      <Button variant="primary"
          style={{
            borderRadius: "0.4rem",
            border: "none",
            padding: "1rem" 
          }} className="justify-content-start"
          onClick={handleShow}> Add Batch
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
        }}>  <label style={{ margin: '10px' }}>Add JSON file to add batch:</label>
         <div div style={{ display: 'flex', flexDirection: 'row' }}>
  {/* First section with input and buttons arranged horizontally */}
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column',width:'50%', marginBottom:'0.6rem' }}>
    
  <label htmlFor="fileInput" style={{ display: 'block', border: '1px solid #ccc', borderRadius: '0.6rem', padding: '8px', width: '100%', height: '100%' , alignItems: 'center',
    justifyContent: 'center',}}>
  <input
    id="fileInput"
    type="file"
    accept=".json"
    required
    onChange={handleFileChange}
    style={{
      display: 'none',// Hide the default file input button
    }}
  />
  Choose File Text 
</label>

  </div>

  {/* Second section with two columns for buttons */}
  <div style={{ display: 'flex', flexDirection: 'column',width:'50%' }}>
    <div >
      <Button
        variant="secondary"
        onClick={registerUsers}
        style={{
          padding: '0.625rem 1rem',
          backgroundColor: '#24549A',
          color: 'white',
          border: 'none',
          borderRadius: '0.625rem',
          cursor: 'pointer',
        
          transition: 'background-color 0.3s ease',
          margin: '0.625rem',
          width: '90%',
          height: '50px',
          marginRight:'0px',
         
        }}
      >
        Register Users
      </Button>
      {/* Add other content if needed */}
    </div>

    <div >
      <Button
        variant="secondary"
        onClick={deleteData}
        style={{
          padding: '0.625rem 1rem',
          backgroundColor: '#24549A',
          color: 'white',
          border: 'none',
          borderRadius: '0.625rem',
          cursor: 'pointer',
      
          transition: 'background-color 0.3s ease',
          margin: '0.625rem',
          width: '90%',
          height: '50px',
          marginRight:'0px',
          
        }}
      >
        Delete Data
      </Button>
      {/* Add other content if needed */}
    </div>
  </div>
</div>


        </Modal.Body>

        <Modal.Footer className="text-center"
         style={{
          backgroundColor: 'white',
          border: 'none',
          borderRadius: '0 0 1.25rem 1.25rem', paddingTop: '0rem' ,// 20px converted to rem
          displat: 'flex',
          justifyContent: 'center',
        }}>
          <Button
        variant="secondary"
        onClick={handleClose}
        style={{
          padding: '0.625rem 1rem',
          backgroundColor: '#24549A',
          color: 'white',
          border: 'none',
          borderRadius: '0.625rem',
          cursor: 'pointer',
      
          transition: 'background-color 0.3s ease',
          margin: '0.625rem',
          width: '30%',
          height: '50px',
       
          
        }}
      >
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
