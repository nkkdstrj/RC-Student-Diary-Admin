import { deleteObject, getDownloadURL, listAll, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";
import { storage } from "../../firebase-config"; // Import the Firebase storage reference
import Filedel from "./del";

function StudentManager() {
  const [fileList, setFileList] = useState([]);
  const [selectedFileURL, setSelectedFileURL] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [users, setUsers] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");

  // Function to list files in Firebase Storage
  const listFiles = async () => {
    try {
      const files = await listAll(ref(storage, 'Content/'));
      const fileArray = files.items.map((fileRef) => ({
        name: fileRef.name,
        fullPath: fileRef.fullPath,
      }));
      setFileList(fileArray);
      setUsers(fileArray);
    } catch (error) {
      console.error("Error listing files:", error);
    }
  };

  // Function to get the download URL of a file
  const getFileURL = async (fileFullPath) => {
    try {
      const fileRef = ref(storage, fileFullPath);
      const downloadURL = await getDownloadURL(fileRef);
      setSelectedFileURL(downloadURL);
    } catch (error) {
      console.error("Error getting file URL:", error);
    }
  };

  // Function to delete a file from Firebase Storage
  const deleteFile = async (fileFullPath) => {
    try {
      const fileRef = ref(storage, fileFullPath);
      await deleteObject(fileRef);
      listFiles(); // Refresh the file list after deletion
    } catch (error) {
      console.error("Error deleting the file:", error);
    }
  };

  useEffect(() => {
    listFiles();
  }, []); // Run once on component mount

  const search = (event) => {
    const searchTerm = event.target.value.toLowerCase();

    const matchedUsers = fileList.filter((user) => {
      return user.name.toLowerCase().includes(searchTerm);
    });

    setUsers(matchedUsers);
    setSearchPhrase(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

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

 // ... (Previous code remains the same)

return (
  <>
    <div className="content-wrapper" style={{ paddingTop: '0px' }}>
      <div className="wrapper" style={{ paddingTop: '0px',  }}>
      <div className="search-container d-flex justify-content-end align-items-center mb-2" style={{ margin: '20px', padding:'10px'}}>
  <input
    type="text"
    placeholder="Search"
    value={searchPhrase}
    onChange={search}
    style={{
      width: "200px",
      border: "1px solid #ced4da", // Add border style here
      borderRadius: "5px", // Optional: Add border-radius for a rounded border
      padding: "5px", // Optional: Adjust padding for better appearance
borderColor:'black'
    }}
  />
</div>

        <div className="table-responsive rounded p-3 bg-light "
          style={{ backgroundColor: "#ADD8E6", boxShadow: "0 7px 8px rgba(0, 0, 0, 0.3)", borderRadius:'10px' }}>
          <table className="table table d-none d-md-table">
            <colgroup>
              <col style={{ width: "50%" }} />
              <col style={{ width: "50%" }} />
            </colgroup>
            <thead>
              <tr>
                <th className="text-center" style={{ color: 'black',fontSize:'17px', }}><strong>File Name</strong></th>
                <th className="text-center" style={{ color: 'black',fontSize:'17px', }}><strong>Actions</strong></th>
              </tr>
            </thead>
            <tbody>
              {usersToDisplay.map((file) => (
                <tr key={file.fullPath}>
                  <td style={{ textDecoration: 'none',padding:'0px'}}>
                    <button className="btn text-secondary" ><p style={{ color: 'black', fontSize:'13px', textAlign:'start', margin:'0px',padding:'10px'}}>{file.name}</p></button>
                  </td>
                  <td className="text-center" style={{ textDecoration: 'none',padding:'0px'}}>
                    <Filedel handleDelete={() => deleteFile(file.fullPath)} />
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
  </>
);

};

export default StudentManager;
