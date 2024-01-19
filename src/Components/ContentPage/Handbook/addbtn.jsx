import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import "./content.css";
function Addbtn({ handleAddButton }) {
  const [show, setShow] = useState(false);
  const [buttonName, setButtonName] = useState('');
  const [error, setError] = useState(''); 

  const handleClose = () => {
    setShow(false);
    setButtonName('');
    setError('');
  };

  const handleShow = () => setShow(true);

  const handleAdd = () => {
    if (!buttonName) {
      setError('Button name is required');
      return;
    }

    handleAddButton(buttonName);
    handleClose();
  };


  return (
    <>
      <button
        onClick={handleShow}
       className='button_add'
      >
        ADD BUTTON
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
        className="d-flex justify-content-start align-items-center"
        style={{
          backgroundColor: "#1e329c",
          border: "none",
          borderRadius: '1.25rem 1.25rem 0 0', 
        }}
      >
        <h3 style={{ margin: '0', marginLeft: '0.9375rem' }}> 
          <span>Add Button</span>
        </h3>
      </Modal.Header>
      <Modal.Body
        style={{
          backgroundColor: "white",
          border: "none",
          color: "grey",
          padding: '0.9375rem 2.5rem 0rem 2.5rem',
        }}
      >
        
        <Form.Group>
          <Form.Label style={{ fontSize: "0.9375rem", margin: '0', marginLeft: '0.3125rem' }}> 
            Button Name:
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter button name "
            value={buttonName}
            onChange={(e) => setButtonName(e.target.value)}
            style={{ borderRadius: '0.625rem', borderColor: 'grey' }} 
          />
           <h6 style={{ color: 'transparent', margin: '0rem 0rem 0rem 0.25rem ', height: '1.25rem' }}>
           {error && <h6 style={{ color: 'red' }}>{error}</h6>}
    </h6>
          
           
        </Form.Group>
      </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '0 0 1.25rem 1.25rem', paddingTop: '0rem'
          }}
          className="d-flex justify-content-center align-items-center"
        >
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
              boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.2)', 
              transition: 'background-color 0.3s ease',
              margin: '0.625rem',
              width: '25%',
            }}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleAdd}
            style={{
              padding: '0.625rem 1rem', 
              backgroundColor: '#24549A',
              color: 'white',
              border: 'none',
              borderRadius: '0.625rem',
              cursor: 'pointer',
              boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.2)', 
              transition: 'background-color 0.3s ease',
              margin: '0.625rem',
              width: '25%', 
            }}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Addbtn;
