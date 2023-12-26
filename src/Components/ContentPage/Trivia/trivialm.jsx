import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
function Triviam({ handleAddButton, titlecontent  }) {
  const [show, setShow] = useState(false);
  const [buttonName, setButtonName] = useState('');
  const [error, setError] = useState(''); // State for error message

  const handleClose = () => {
    setShow(false);
 
    setError('');
  };
  useEffect(() => {
    if (titlecontent) {
        setButtonName(titlecontent);
    }
    
  }, [titlecontent]);
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
      <button   onClick={handleShow} style={{ alignSelf: 'flex-start', border:'none', borderRadius:'5px', backgroundColor:'#B4E4FD' }}> <span style={{ fontSize: '12px' }}>Read more</span> </button>

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
          <span>Trivia</span>
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
          
        <p
  style={{
    border: 'none',
    borderRadius: '0.625rem',
    padding: '0.5rem',
    width: '100%', 
    fontSize:'18px'// Ensure the paragraph spans the container width
  }}
>
  {buttonName}
</p>
     
   
          
           
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
            Close
          </Button>
        
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Triviam;
