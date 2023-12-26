import { Edit } from "@mui/icons-material";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../firebase-config';

function RegisterModal() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [FullName, setFullName] = useState('');
  const [EmailAddress, setEmailAddress] = useState('');
  const [StudentNumber, setStudentNumber] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isValidPhoneNumber = (PhoneNumber) => {
    const phoneRegex = /^\d{11}$/;
    return phoneRegex.test(PhoneNumber);
  };

  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hashHex;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (FullName && StudentNumber && EmailAddress && PhoneNumber && password && confirmPassword && password === confirmPassword) {
      if (!isValidPhoneNumber(PhoneNumber)) {
        setErrorMessage('Please enter a valid 11-digit phone number.');
        return;
      }

      try {
        const hashedPassword = await hashPassword(password);

        const userCredential = await createUserWithEmailAndPassword(auth, EmailAddress, hashedPassword);
        const user = userCredential.user;

        const userData = {
          StudentNumber,
          EmailAddress,
          FullName,
          PhoneNumber,
          hashedPassword,
        };
        
        const userRef = ref(db, `Users/${user.uid}`);
        set(userRef, userData);

        setErrorMessage('User registered successfully');
        setEmailAddress('');
        setStudentNumber('');
        setFullName('');
        setEmailAddress('');
        setPhoneNumber('');
        setPassword('');
        setConfirmPassword('');
      } catch (error) {
        setErrorMessage(error.message);
      }
    } else {
      setErrorMessage('Please fill in all details and make sure passwords match.');
    }
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow} > ADD STUDENT <Edit/></Button>

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
            <h1>Add Student</h1>
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="text-left"
         style={{
          backgroundColor: "white",
          border: "none",
          color: "grey",
          padding: '0.9375rem 2.5rem 0rem 2.5rem', // 15px and 20px converted to rem
        }}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="studNum" class="col-form-label">Student Number:</label>
            <input class="form-control" type="text" id="studNum" required value={StudentNumber} onChange={(e) => setStudentNumber(e.target.value)} /><br />
            
            <label htmlFor="FullName" class="col-form-label">Full Name:</label>
            <input class="form-control" type="text" id="FullName" required value={FullName} onChange={(e) => setFullName(e.target.value)} /><br />

            <label htmlFor="email" class="col-form-label">Email:</label>
            <input class="form-control" type="email" id="email" required value={EmailAddress} onChange={(e) => setEmailAddress(e.target.value)} /><br />

            <label htmlFor="phoneNum" class="col-form-label">Phone Number:</label>
            <input class="form-control" type="text" id="phoneNum" required value={PhoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} /><br />

            <label htmlFor="passWord" class="col-form-label">Password:</label>
            <input class="form-control" type="password" id="passWord" required value={password} onChange={(e) => setPassword(e.target.value)} /><br />

            <label htmlFor="confPass" class="col-form-label">Confirm Password:</label>
            <input class="form-control" type="password" id="confPass" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /><br />

            <button type="submit" >Register</button>
          </form>

          <div style={{ color: 'red' }}>{errorMessage}</div>
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
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RegisterModal;
