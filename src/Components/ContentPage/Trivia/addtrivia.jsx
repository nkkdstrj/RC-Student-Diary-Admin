import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function Addtrivia({ handleAddButton }) {
  const [show, setShow] = useState(false);
  const [buttonName, setButtonName] = useState('');
  const [error, setError] = useState(''); // State for error message

  const handleClose = () => {
    setShow(false);
    setButtonName('');
    setError('');
  };

  const handleShow = () => setShow(true);

  const handleAdd = () => {
    if (!buttonName) {
      setError('Triva shit is required');
      return;
    }

    handleAddButton(buttonName);
    handleClose();
  };


  return (
    <>
      <button
        onClick={handleShow}
        style={{
          padding: '8px 16px',
          backgroundColor: '#24549A',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'background-color 0.3s ease',
          marginLeft: '25px',
          padding: '10px 35px 10px 35px',
        }}
      >
        ADD TRIVIA
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
          borderRadius: '1.25rem 1.25rem 0 0', // 20px converted to rem
        }}
      >
        <h3 style={{ margin: '0', marginLeft: '0.9375rem' }}> {/* 15px converted to rem */}
          <span>Trivia </span>
        </h3>
      </Modal.Header>
      <Modal.Body
        style={{
          backgroundColor: "white",
          border: "none",
          color: "grey",
          padding: '0.9375rem 2.5rem 0rem 2.5rem', // 15px and 20px converted to rem
        }}
      >
        
        <Form.Group>
          
          
        <Form.Control
          as="textarea"
            placeholder="Enter trivia "
            value={buttonName}
            rows={5}
            onChange={(e) => setButtonName(e.target.value)}
            style={{ borderRadius: '0.625rem', borderColor: 'grey',height:'100px' }} // 10px converted to rem
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
            borderRadius: '0 0 1.25rem 1.25rem', paddingTop: '0rem' // 20px converted to rem
          }}
          className="d-flex justify-content-center align-items-center"
        >
          <Button
            variant="secondary"
            onClick={handleClose}
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
            onClick={handleAdd}
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
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Addtrivia;
