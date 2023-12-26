import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { AiFillCloseCircle } from 'react-icons/ai';
function Subdel({ titlecontent, handleDelete }) {
  const [show, setShow] = useState(false);
  const [buttonName, setButtonName] = useState('');
  const [error, setError] = useState(''); // State for error message

  const handleClose = () => {
    setShow(false);
    setError('');
  };


  const handleShow = () => setShow(true);

  return (
    <>
      <button onClick={handleShow} className="btn text-secondary" style={{ fontSize: "13px", padding: '0px', marginLeft: '5px', marginRight: '8px' }}>
        <span><AiFillCloseCircle /></span>
      </button>
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
            borderRadius: '1.25rem 1.25rem 0 0', // 20px converted to rem
          }}
        >
          <Modal.Title className="">
            <DeleteIcon fontSize="large" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center"
          style={{
            backgroundColor: "white",
            border: "none",
            color: "grey",
            padding: '0.9375rem 2.5rem 0rem 2.5rem', // 15px and 20px converted to rem
          }}
        >
          <h1>Delete Sub Button</h1>
          <p>Deleting Sub Button is permanent and cannot be undone</p>
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '0 0 1.25rem 1.25rem', paddingTop: '0rem' // 20px converted to rem
          }}
          className="d-flex justify-content-center align-items-center"
        >
          <Button
            variant="secondary"
            onClick={() => {
     
              handleClose(); // Close the modal after deletion
            }}
            style={{
              padding: '0.625rem 1rem', // 10px and 16px converted to rem
              backgroundColor: '#24549A',
              color: 'white',
              border: 'none',
              borderRadius: '0.625rem',
              cursor: 'pointer',
              boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.2)', // 2px converted to rem
              transition: 'background-color 0.3s ease',
              margin: '0.625rem',
              width: '25%', // Keep this as it is since it's a relative value
            }}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            
  onClick={() => {
    handleDelete(); // Call the handleDelete function passed from Trivia
    handleClose(); // Close the modal after deletion
  }}
            style={{
              padding: '0.625rem 1rem', // 10px and 16px converted to rem
              backgroundColor: '#24549A',
              color: 'white',
              border: 'none',
              borderRadius: '0.625rem',
              cursor: 'pointer',
              boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.2)', // 2px converted to rem
              transition: 'background-color 0.3s ease',
              margin: '0.625rem',
              width: '25%', // Keep this as it is since it's a relative value
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Subdel;
