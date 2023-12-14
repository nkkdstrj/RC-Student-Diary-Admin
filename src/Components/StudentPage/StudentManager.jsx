import { IconButton } from "@mui/material";
import { deleteUser, getAuth } from 'firebase/auth';
import { getDatabase, onValue, orderByChild, query, ref, remove, update } from 'firebase/database';
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { AiFillCloseCircle, AiOutlineCaretLeft, AiOutlineCaretRight, AiOutlineEllipsis } from "react-icons/ai";
import { BsFillPencilFill } from "react-icons/bs";
import { app } from '../../firebase-config';
import BatchModal from "../Home/UserManagement/batchmodal";
import RegisterModal from "../Home/UserManagement/registermodal";

const StudentManager = () => {
  const [users, setUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [viewMoreDetails, setViewMoreDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");

  useEffect(() => {
    const usersRef = ref(getDatabase(app), 'Users');
    const usersQuery = query(usersRef, orderByChild('StudentNumber'));

    const unsubscribe = onValue(usersQuery, (snapshot) => {
      if (snapshot.exists()) {
        const usersArray = [];

        snapshot.forEach((childSnapshot) => {
          const userId = childSnapshot.key;
          const userData = childSnapshot.val();

          usersArray.push({
            userId,
            ...userData,
          });
        });

        setUsers(usersArray);
        setFilteredUsers(usersArray);
      } else {
        setUsers([]);
        setFilteredUsers([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const smallButtonStyle = {
    fontSize: "13px",
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  const handleSaveEditedUser = (editedUser) => {
    if (editedUser) {
      const { userId, FullName, PhoneNumber, EmailAddress, StudentNumber } = editedUser;
      const userRef = ref(getDatabase(app), `Users/${userId}`);
      const updatedUserData = {
        userId: userId,
        StudentNumber: StudentNumber,
        EmailAddress: EmailAddress,
        FullName: FullName,
        PhoneNumber: PhoneNumber,
      };

      update(userRef, updatedUserData)
        .then(() => {
          setShowEditModal(false);
        })
        .catch((error) => {
          console.error("Error updating user: ", error);
        });
    }
  };

  const handleDeleteUser = (selectedUser) => {
    if (selectedUser) {
      const userId = selectedUser.userId;

      const auth = getAuth();
      const email = selectedUser.EmailAddress;

      deleteUser(auth.currentUser, email)
        .then(() => {
          console.log('Successfully deleted user from Firebase Authentication');
        })
        .catch((error) => {
          console.error('Error deleting user from Firebase Authentication:', error);
        });

      const userRef = ref(getDatabase(app), `Users/${userId}`);

      remove(userRef)
        .then(() => {
          // Update the state to remove the deleted user
          setUsers((prevUsers) => prevUsers.filter(user => user.userId !== userId));
          setShowDeleteModal(false);
        })
        .catch((error) => {
          console.error("Error removing user: ", error);
          // Handle error, e.g., display an error message to the user
        });
        const userReff = ref(getDatabase(app), `Notes/${userId}`);

        remove(userReff)
          .then(() => {
            // Update the state to remove the deleted user
            setUsers((prevUsers) => prevUsers.filter(user => user.userId !== userId));
            setShowDeleteModal(false);
          })
          .catch((error) => {
            console.error("Error removing user: ", error);
            // Handle error, e.g., display an error message to the user
          });
    }
  };

  const handleViewMore = (user) => {
    setViewMoreDetails(user);
    setShowMore(true);
  };

  const usersPerPage = 10;
  const search = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const matchedUsers = users.filter((user) => {
      return (
        user.StudentNumber.toLowerCase().includes(searchTerm) ||
        user.EmailAddress.toLowerCase().includes(searchTerm) ||
        user.FullName.toLowerCase().includes(searchTerm) ||
        user.PhoneNumber.toLowerCase().includes(searchTerm)
      );
    });
    setFilteredUsers(matchedUsers);
    setSearchPhrase(event.target.value);
    setCurrentPage(1);
  };

  //pagination
  const firstIndex = (currentPage - 1) * usersPerPage;
  const lastIndex = Math.min(currentPage * usersPerPage, users.length);
  const usersToDisplay = users.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(users.length / usersPerPage);
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
       <div className="content-wrapper" >
       <div className="content">
        <div className="wrapper">
        <div style={{ marginBottom: '30px', background: 'white' }}>
          <h2>Student Manager</h2>
         
        </div>
        <div className="d-flex justify-content-between align-items-center mb-2">
  <div>
    <RegisterModal />
    <BatchModal />
  </div>
  {/* search bug need irefresh para mag reset ung search*/}
  <div className="search-container d-flex align-items-center" style={{ margin: '20px', padding: '10px' }}>
    <input
      type="text"
      placeholder="Search"
      value={searchPhrase}
      onChange={search}
      style={{
        width: "200px",
        border: "1px solid #ced4da",
        borderRadius: "5px",
        padding: "5px",
        borderColor: 'black'
      }}
    />
  </div>
</div>


          <div className="table-responsive rounded p-3 bg-light"
       style={{ backgroundColor: "#ADD8E6", boxShadow: "0 7px 8px rgba(0, 0, 0, 0.3)", borderRadius:'10px' }}>
        <table className="table table d-none d-md-table">
          <thead>
            <tr>
              <th className="text-center"style={{ color: 'black',fontSize:'17px', }}><strong>STUDENT NUMBER</strong></th>
              <th></th>
              <th className="text-center"style={{ color: 'black',fontSize:'17px', }}><strong>EMAIL ADDRESS</strong></th>
              <th className="text-center"style={{ color: 'black',fontSize:'17px', }}><strong>FULL NAME</strong></th>
              <th className="text-center"style={{ color: 'black',fontSize:'17px', }}><strong>PHONE NUMBER</strong></th>
              <th className="text-center"style={{ color: 'black',fontSize:'17px', }}><strong>Actions</strong></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.userId}>
                <td>
                  <td className="centered-cell">{user.StudentNumber}</td>
                </td>
                <td></td>
                <td className="centered-cell">{user.EmailAddress}</td>
                <td className="centered-cell">{user.FullName}</td>
                <td className="centered-cell">{user.PhoneNumber}</td>
                <td>
                <div className="d-flex justify-content-center align-items-center">
                  <span className="d-flex d-sm-inline-flex " >
                      <IconButton
                      
                      style={{ fontSize:'17px',}}
                        onClick={() => handleEditUser(user)}
                      >
                        <BsFillPencilFill />
                      </IconButton>
                    </span>
                    <span className="d-flex d-sm-inline-flex ">
                    <IconButton>
                      <AiFillCloseCircle
                      
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                        style={{ fontSize:'19px'  }}
                      />
                        </IconButton>
                    </span>
                    <span className="d-flex d-sm-inline-flex ">
                          <IconButton style={{ fontSize:'19px' }}>
                            <AiOutlineEllipsis
                            onClick={() => {
                              handleViewMore(user);
                              setShowMore(true);
                            }}/>
                          </IconButton>
                        </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

         {/* Pagination */}
          <div className="d-block"style={{ marginTop: '20px', }} >
          <nav className="d-flex justify-content-end align-items-center mb-2 ">
            <ul className="pagination" style={{ boxShadow: "0 7px 8px rgba(0, 0, 0, 0.3)" }}>
              <li className="page-item">
                <a href="#" className="page-link" onClick={prePage} style={{ color: 'black', }} >
                  <AiOutlineCaretLeft />
                </a>
              </li>
              {pageNumbers.map((number) => (
                <li
              
                  key={number} >
                  <a style={{ color: 'black', }} 
                    href="#"
                    className="page-link"
                    onClick={() => changeCPage(number)}>
                    {number}
                  </a>
                </li>
              ))}
              <li className="page-item">
                <a style={{ color: 'black', }}  href="#" className="page-link" onClick={nextPage}>
                  <AiOutlineCaretRight />
                </a>
              </li>
            </ul>
          </nav>
        </div>
        </div>
      </div>
</div>
 {/* Edit User Modal */}
      <Modal className="text-white" show={showEditModal} onHide={() => setShowEditModal(false)}
      dialogClassName="custom-modal">
        <Modal.Header closeButton
        style={{
          backgroundColor: "#1e329c",
          border: "none",
          borderRadius: '1.25rem 1.25rem 0 0', // 20px converted to rem
        }}>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body
        style={{
          backgroundColor: "white",
          border: "none",
          color: "grey",
          padding: '0.9375rem 2.5rem 0rem 2.5rem', // 15px and 20px converted to rem
        }}>
        <label htmlFor="editStudentNumber" class="col-form-label">Student Number:</label>
          {/* should we let change for userId student number */}
          <input
          class="form-control"
            id="editStudentNumber"
            value={editUser?.StudentNumber || ''}
            onChange={(e) => setEditUser({ ...editUser, StudentNumber: e.target.value })}
            // onChange={(e) => setEditUser({ ...editUser})}
          />   
        <label htmlFor="editEmail" class="col-form-label">Email Address:</label>
          {/* should we let change for userId student number */}
          <input
          class="form-control"
            id="editEmail"
            value={editUser?.EmailAddress || ''}
            onChange={(e) => setEditUser({ ...editUser, EmailAddress: e.target.value })}
            // onChange={(e) => setEditUser({ ...editUser})}
          />
          <label htmlFor="editFullName" class="col-form-label">Edit full name:</label>
          <input
          class="form-control" 
            id="editFullName"
            value={editUser?.FullName || ''}
            onChange={(e) => setEditUser({ ...editUser, FullName: e.target.value })}
          />
          <label htmlFor="editPhoneNumber" class="col-form-label">Edit phone number:</label>
          <input
          class="form-control"
            id="editPhoneNumber"
            type="number"
            value={editUser?.PhoneNumber || ''}
            onChange={(e) => setEditUser({ ...editUser, PhoneNumber: e.target.value })}
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
          <Button variant="primary" onClick={() => handleSaveEditedUser(editUser)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

{/* Delete User Modal */}
      <Modal className="text-white" show={showDeleteModal} onHide={() => setShowDeleteModal(false)}
      dialogClassName="custom-modal">
        <Modal.Header closeButton
        style={{
          backgroundColor: "#1e329c",
          border: "none",
          borderRadius: '1.25rem 1.25rem 0 0', // 20px converted to rem
        }}>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body
        style={{
          backgroundColor: "white",
          border: "none",
          color: "grey",
          padding: '0.9375rem 2.5rem 0rem 2.5rem',
          textAlign: 'center' // 15px and 20px converted to rem
        }}>
          Are you sure you want to delete the user:<br />
          {selectedUser?.FullName}?
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
            onClick={() => handleDeleteUser(selectedUser)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

{/* view more */}
      <Modal  className="text-white" show={showMore} onHide={() => setShowMore(false)}
      dialogClassName="custom-modal">
        <Modal.Header closeButton
         style={{
          backgroundColor: "#1e329c",
          border: "none",
          borderRadius: '1.25rem 1.25rem 0 0', // 20px converted to rem
        }}>
          <Modal.Title> adfadfa </Modal.Title>
        </Modal.Header>
        <Modal.Body
        style={{
          backgroundColor: "white",
          border: "none",
          color: "grey",
          padding: '0.9375rem 2.5rem 0rem 2.5rem', // 15px and 20px converted to rem
        }}>
          <div>
            <strong>Email Address:</strong> 
            <label class="form-control">{viewMoreDetails?.EmailAddress} </label>
          </div>
          <div>
            <strong>Student Number:</strong> 
            <label class="form-control">{viewMoreDetails?.StudentNumber}</label>
          </div>
          <div>
            <strong>Full Name:</strong> 
            <label class="form-control">{viewMoreDetails?.FullName}</label>
          </div>
          <div>
            <strong>Phone Number:</strong> 
            <label class="form-control">{viewMoreDetails?.PhoneNumber}</label>
          </div>
        </Modal.Body>
        <Modal.Footer
        style={{
          backgroundColor: 'white',
          border: 'none',
          borderRadius: '0 0 1.25rem 1.25rem', paddingTop: '0rem' // 20px converted to rem
        }}>
          <Button variant="secondary" onClick={() => setShowMore(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StudentManager;