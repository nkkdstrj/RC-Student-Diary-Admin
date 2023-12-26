import { get, getDatabase, ref, update } from 'firebase/database';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { BsFillPencilFill } from 'react-icons/bs';
function Editmain({buttonNamee, buttonKeyy,updateButtonData}) {
  const [show, setShow] = useState(false);
  const [buttonName, setButtonName] = useState('');
  const [error, setError] = useState(''); // State for error message
  const [buttonData, setButtonData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase();
        const dataRef = ref(db, 'diarycontent_btn');
        const snapshot = await get(dataRef);
        const data = snapshot.val();
        console.log('Fetched Data:', data);
        setButtonData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const handleClose = () => {
    setShow(false);
    
    setError('');
  };
  useEffect(() => {
    if (buttonNamee) {
        setButtonName(buttonNamee);
    }
    
  }, [buttonNamee]);
  const handleShow = () => setShow(true);

  const handleAddButton = async () => {
    try {
      if (!buttonName) {
        setError('Button name is required');
        return;
      }
  
      const db = getDatabase();
      const newButtonRef = ref(db, `diarycontent_btn/${buttonKeyy}`);
      await update(newButtonRef, { buttonname: buttonName });
  
      setButtonName(buttonName); // Update local state directly
      handleClose(); // Close modal after successful edit
      updateButtonData(); 
      setButtonData((prevData) => ({
        ...prevData,
        [buttonKeyy]: {
          buttonname: buttonName,
          btn_sub_btns: {},
        },
      }));
    } catch (error) {
      console.error('Error updating button:', error);
    }
  };
  return (
    <>
       <button onClick={(handleShow)} className="btn text-secondary" style={{ fontSize: "15px", padding: '0px' }}>
      <span><BsFillPencilFill /></span>
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
          <span>Edit Button </span>
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
            type="text"
            placeholder="Enter Button Name "
            value={buttonName}
            onChange={(e) => setButtonName(e.target.value)}
            style={{ borderRadius: '0.625rem', borderColor: 'grey' }} // 10px converted to rem
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
            onClick={handleAddButton} 
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
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Editmain;
