import IconButton from "@mui/material/IconButton";
import "bootstrap/dist/css/bootstrap.min.css";
import { getDatabase, onValue, orderByChild, query, ref, remove, update } from 'firebase/database';
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { AiFillCloseCircle, AiOutlineCaretLeft, AiOutlineCaretRight, AiOutlineEllipsis } from "react-icons/ai";
import { BsFillPencilFill } from "react-icons/bs";
import { app } from '../../firebase-config';
import ReminderModal from "./Reminder_Components/ReminderManagement/remindermodal";
// import ReminderEditor from "../sfromreactfirebase/RMCOpy/remindereditor copy";

const ReminderPage = () => {
  const [reminders, setReminders] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [editReminder, setEditReminder] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [viewMoreDetails, setViewMoreDetails] = useState(null);

  useEffect(() => {
    const remindersRef = ref(getDatabase(app), 'PublicReminders');
    const remindersQuery = query(remindersRef, orderByChild('createdTimestamp'));

    const unsubscribe = onValue(remindersQuery, (snapshot) => {
      if (snapshot.exists()) {
        const reminderArray = [];
        snapshot.forEach((childSnapshot) => {
          const userId = childSnapshot.key;
          childSnapshot.forEach((dateSnapshot) => {
            reminderArray.push({
              userId,
              date: dateSnapshot.key,
              ...dateSnapshot.val(),
            });
          });
        });

        setReminders(reminderArray);
      } else {
        setReminders([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const smallButtonStyle = {
    fontSize: "13px",
  };

  const handleDeleteReminder = (selectedReminder) => {
    if (selectedReminder) {
      const userId = selectedReminder.userId;
      const date = selectedReminder.date;

      const remindersRef = ref(getDatabase(app), `PublicReminders/${userId}/${date}`);
      
      remove(remindersRef)
        .then(() => {
          // Update the state to remove the deleted reminder
          setReminders((prevReminders) => prevReminders.filter(reminder => !(reminder.userId === userId && reminder.date === date)));
          setShowDeleteModal(false);
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
          // Handle error, e.g., display an error message to the user
        });
    }
  };

    // Function to handle edit for a reminder
    const handleEditReminder = (reminder) => {
      setSelectedReminder(reminder);
      setEditReminder({ ...reminder }); // Create a copy of the selected reminder for editing
    };

  // Function to save the edited reminder
  const saveEditedReminder = () => {
    if (selectedReminder) {
      const userId = selectedReminder.userId;
      const date = selectedReminder.date;

      const editedRemindersRef = ref(getDatabase(app), `PublicReminders/${userId}/${date}`);
      update(editedRemindersRef, editReminder); // Update the reminder with edited data

      setSelectedReminder(null); // Clear selected reminder
      setEditReminder({}); // Clear the edited reminder
    }
  };

    // Function to handle "View More" button click
    const handleViewMore = (reminder) => {
      setViewMoreDetails(reminder);
      setShowMore(true);
    };
      // Function to handle "View More" button click
  // const handleViewMore = (reminder) => {
  //   // Pass the selected reminder to the modal component
  //   // setSelectedReminder(reminder);
  //   setViewMoreDetails(reminder);
  //   // Set the state to show the modal
  //   setShowMore(true);
  // };


  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const remindersPerPage = 10;
  const lastIndex = currentPage * remindersPerPage;
  const firstIndex = lastIndex - remindersPerPage;
  const reminderstodisplay = reminders.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(reminders.length / remindersPerPage);
  const pageRange = 6;
  let minPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
  let maxPage = minPage + pageRange - 1;

  if (maxPage > totalPages) {
    maxPage = totalPages;
    minPage = Math.max(1, maxPage - pageRange + 1);
  }

  const pageNumbers = Array.from(
    { length: maxPage - minPage + 1 },
    (_, i) => minPage + i
  );

  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changeCPage(page) {
    setCurrentPage(page);
  }

  function nextPage() {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  return (
    <>
      <div className="content-wrapper">
      <div className="content">
        <div className="wrapper" >
        <div style={{ marginBottom: '30px', background: 'white' }} >
          <h2>Reminder</h2>
         
        </div>
          <div className="d-flex justify-content-between align-items-center mb-2" style={{height: '97px',marginLeft:'10px'}}  >
            <div >
                <ReminderModal  />
            </div>
          </div>

          <div className="table-responsive rounded p-3 bg-light" 
          style={{ backgroundColor: "#ADD8E6", boxShadow: "0 7px 8px rgba(0, 0, 0, 0.3)",
          // border: "none",
          // borderRadius: '1.25rem 1.25rem 0 0',
          }}>
            <table className="table table d-none d-md-table">
              <thead>
                <tr>
                <th className="text-center"style={{ color: 'black',fontSize:'17px', }}><strong>REMINDER TITLE</strong></th>
                  <th></th>
                  <th className="text-center"style={{ color: 'black',fontSize:'17px', }}><strong>DATE</strong></th>
                  <th className="text-center"style={{ color: 'black',fontSize:'17px', }}><strong>TIME</strong></th>
                  {/* <th className="text-center">Date Created</th> */}
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reminderstodisplay.map((reminder) => (
                  <tr key={reminder.userId}>
                    <td>
                      <td className="centered-cell">{reminder.eventName}</td>
                    </td>
                    <td></td>
                    <td className="centered-cell">{reminder.date}</td>
                    <td className="centered-cell">{reminder.eventTime}</td>
                    {/* <td className="centered-cell">{reminder.createdTimestamp}</td> */}
                    <td>
                    <div className="d-flex justify-content-center align-items-center">
                  <span className="d-flex d-sm-inline-flex ">
                          <IconButton
                        
                            style={{ fontSize:'17px' }}
                          >
                            <BsFillPencilFill onClick={() => {handleEditReminder(reminder); setShowEditModal(true)}} />
                          </IconButton>
                        </span>
                        <span className="d-flex d-sm-inline-flex">
                          <IconButton>
                            <AiFillCloseCircle
                             
                              onClick={() => {
                                setSelectedReminder(reminder);
                                setShowDeleteModal(true);
                              }}
                              style={{ fontSize:'19px'  }}
                             
                              // style={smallButtonStyle}
                            />            
                          </IconButton>
                        </span>
                        <span className="d-flex d-sm-inline-flex ">
                          <IconButton style={{ fontSize:'19px' }}>
                            <AiOutlineEllipsis
                            onClick={() => {
                              handleViewMore(reminder)
                              setShowMore(true);
                            }}/>
                          </IconButton>
                          {/* <ReminderDetailsModal
                           showMore={showMore}
                           setShowMore={setShowMore}
                           selectedReminder={reminder}
                           handleViewMore={handleViewMore} 
                          /> */}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-block"style={{ marginTop: '20px', }} >
            <nav class="d-flex justify-content-end align-items-center mb-2 ">
              <ul className="pagination" style={{boxShadow: "0 7px 8px rgba(0, 0, 0, 0.3)" }}>
                <li className="page-item">
                  <a href="#" className="page-link" onClick={prePage} style={{ color: 'black', }} >
                    <AiOutlineCaretLeft />
                  </a>
                </li>
                {pageNumbers.map((number) => (
                  <li
                  
                  >
                    <a
                      href="#"
                      className="page-link"
                      onClick={() => changeCPage(number)} style={{ color: 'black', }} 
                    >
                      {number}
                    </a>
                  </li>
                ))}
                <li className="page-item">
                  <a href="#" className="page-link" onClick={nextPage} style={{ color: 'black', }} > 
                    <AiOutlineCaretRight />
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      </div>
<Modal
        className="text-white"
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        backdrop="static"
        keyboard={false}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
        dialogClassName="custom-modal"
      >
         <Modal.Header closeButton 
         style={{
          backgroundColor: "#1e329c",
          border: "none",
          borderRadius: '1.25rem 1.25rem 0 0', // 20px converted to rem
        }}>
          <Modal.Title>Edit Reminder</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: "white",
            border: "none",
            color: "grey",
            padding: "0.9375rem 2.5rem 0rem 2.5rem",
          }}
        >
          <label htmlFor="editTitle" className="col-form-label">
            Edit reminder title:
          </label>
          <input
            className="form-control"
            id="editTitle"
            value={editReminder?.eventName || ''}
            onChange={(e) => setEditReminder({ ...editReminder, eventName: e.target.value })}
          />
          <label htmlFor="editTime" className="col-form-label">
            Edit notification time:
          </label>
          <input
            className="form-control"
            type="datetime-local"
            id="editTime"
            value={editReminder?.eventTime || ''}
            onChange={(e) => setEditReminder({ ...editReminder, eventTime: e.target.value })}
          />
          <label htmlFor="editInfo" className="col-form-label">
            Edit notification info:
          </label>
          <textarea
            className="form-control"
            style={{ height: "130px" }}
            type="text"
            id="editInfo"
            value={editReminder?.eventInfo || ''}
            onChange={(e) => setEditReminder({ ...editReminder, eventInfo: e.target.value })}
          />
          {/* Add more fields as needed for editing other properties */}
        </Modal.Body>
        <Modal.Footer
        style={{
          backgroundColor: 'white',
          border: 'none',
          borderRadius: '0 0 1.25rem 1.25rem', paddingTop: '0rem' // 20px converted to rem
        }}>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => saveEditedReminder(editReminder)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      
{/* deletemodal */}
      <Modal  className="text-white" show={showDeleteModal} onHide={() => setShowDeleteModal(false)}
      dialogClassName="custom-modal">
        <Modal.Header closeButton
         style={{
          backgroundColor: "#1e329c",
          border: "none",
          borderRadius: '1.25rem 1.25rem 0 0', // 20px converted to rem
        }}>
          <Modal.Title>Delete Reminder</Modal.Title>
        </Modal.Header>
        <Modal.Body
        style={{
          backgroundColor: "white",
          border: "none",
          color: "grey",
          padding: '0.9375rem 2.5rem 0rem 2.5rem',
          textAlign: 'center' // 15px and 20px converted to rem
        }}>
          Are you sure you want to delete the reminder: <br />
          {selectedReminder?.eventName}?
        </Modal.Body>
        <Modal.Footer
        style={{
          backgroundColor: 'white',
          border: 'none',
          borderRadius: '0 0 1.25rem 1.25rem', paddingTop: '0rem' // 20px converted to rem
        }}>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeleteReminder(selectedReminder)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

 {/* view more */}
 <Modal
        className="text-white"
        show={showMore}
        onHide={() => setShowMore(false)}
        dialogClassName="custom-modal"
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#1e329c",
            border: "none",
            borderRadius: "1.25rem 1.25rem 0 0", // 20px converted to rem
          }}
        >
          <Modal.Title>Reminder Details</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: "white",
            border: "none",
            color: "grey",
            padding: "0.9375rem 2.5rem 0rem 2.5rem", // 15px and 20px converted to rem
          }}
        >

          <div>
            <strong>Event Name:</strong> 
            <label class="form-control">{viewMoreDetails?.eventName} </label>
          </div>
          <div>
            <strong>Event Time:</strong> 
            <label class="form-control">{viewMoreDetails?.eventTime}</label>
          </div>
          <div>
            <strong>Event Info:</strong> 
            <label class="form-control" style={{ height: "130px"}}>{viewMoreDetails?.eventInfo}</label>
          </div>
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: "white",
            border: "none",
            borderRadius: "0 0 1.25rem 1.25rem",
            paddingTop: "0rem", // 20px converted to rem
          }}
        >
          <Button variant="secondary" onClick={() => setShowMore(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReminderPage;
