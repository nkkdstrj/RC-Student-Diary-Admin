import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import * as pdfjsLib from "pdfjs-dist/webpack";
import React, { useState } from "react";
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaFileAudio, FaFilePdf } from "react-icons/fa";
import { storage } from "../../../firebase-config";
function Addmainbtn   ({ onSave, onClose, AddButton })  {
  const [show, setShow] = useState(false);
   const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [audioDownloadUrl, setAudioDownloadUrl] = useState("");
  const [textFromPdf, setTextFromPdf] = useState("");
  const [ButtonName, setButtonName] = useState("");
  const [subButtonName, setSubButtonName] = useState("");
  
  const [downloadable, setDownloadable] = useState(false);
  const [error, setError] = useState('');
  const [errorr, setErrorText] = useState('');
  const [errorf, setErrorpdf] = useState('');
  const [errorn, setErrorname] = useState('');
  const [errorb, setErrornamebut] = useState('');
  const [errora, setErroraudio] = useState('');

  const [showDisplaySection, setShowDisplaySection] = useState(false);
  const [showStyles, setShowStyles] = useState(false);
  const [fileName, setFileName] = useState('Choose File');
  const [AudioName, setAudioName] = useState('Choose Audio');
  
  const handleClose = () => {
    setShow(false);
    setSelectedFile(null);
    setSelectedAudio(null);
    setUploadProgress(0);
    setDownloadUrl("");
    setAudioDownloadUrl("");
    setTextFromPdf("");
    setErrorText("");
    setSubButtonName("");
    setButtonName("");
    setErrorpdf("");
    setErrorname("");
    setErroraudio("");
    setDownloadable(false);
  };
const stylebtn={
  padding: '0.625rem 1rem',
  backgroundColor: '#24549A',
  color: 'white',
  border: 'none',
  borderRadius: '0.625rem',
  cursor: 'pointer',
  boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.2)',
  transition: 'background-color 0.3s ease',
  margin: '0.625rem',
  width: '50%',
  margin: '.6rem 0rem 0rem 0rem',
}
  const handleShow = () => setShow(true);
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
  
    if (file) {
      if (file.name === fileName) {
        setShowDisplaySection(!showDisplaySection);
      } else {
        setFileName(file.name);
        setShowDisplaySection(false);
      }

    }
  
    if (!file) {
      setErrorText('Please select a file.');
      setSelectedFile(null);
    } else if (file.type !== 'application/pdf') {
      setErrorText('Please upload a PDF file.');
      setSelectedFile(null);
    } else {
      setErrorText('');
      setSelectedFile(file);
    }
  };
  const handleAudioChange = (e) => {
    const audio = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
    setSelectedAudio(audio);
    if (audio) {
      setAudioName(audio.name);
      
    }
  if (audio) {
    setDownloadable(false);
  }

    if (!audio) {
      setErrorText('Please select an audio file.');
      setSelectedAudio(null);
    } else if (audio.type !== 'audio/mpeg') {
      setErrorText('Please upload an MP3 audio file.');
      setSelectedAudio(null);
    } else {
      setErrorText('');
      setSelectedAudio(audio);
    }
  };
 

  const handleUpload = () => {
    if (!selectedFile) {

      setErrorpdf('Please select a PDF file');
      return;
    }
   
    if (!subButtonName && !selectedFile ) {
      setErrorname('Please input a button namee.');
      return;
    }
    setShowDisplaySection(true);
    setShowStyles(true);
    const uploadTasks = [];
  
    if (selectedFile) {
      const pdfStorageRef = ref(storage, "Content/" + selectedFile.name);
      const pdfUploadTask = uploadBytesResumable(pdfStorageRef, selectedFile);
  
      const pdfUploadPromise = new Promise((resolve, reject) => {
        pdfUploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error("Error uploading PDF file: ", error);
            reject(error);
          },
          () => {
            getDownloadURL(pdfUploadTask.snapshot.ref)
              .then((downloadURL) => {
                setUploadProgress(100);
                setDownloadUrl(downloadURL);
                extractTextFromPdf(selectedFile);
                resolve(downloadURL);
              })
              .catch((error) => {
                console.error("Error getting PDF download URL: ", error);
                reject(error);
              });
          }
        );
      });
  
      uploadTasks.push(pdfUploadPromise);
    }
 
    if (selectedAudio) {
      const audioStorageRef = ref(storage, "Audio/" + selectedAudio.name);
      const audioUploadTask = uploadBytesResumable(audioStorageRef, selectedAudio);
  
      const audioUploadPromise = new Promise((resolve, reject) => {
        audioUploadTask.on(
          "state_changed",
          (snapshot) => {
            // Handle audio upload progress if needed
          },
          (error) => {
            console.error("Error uploading audio file: ", error);
            reject(error);
          },
          () => {
            getDownloadURL(audioUploadTask.snapshot.ref)
              .then((downloadURL) => {
                setAudioDownloadUrl(downloadURL);
                resolve(downloadURL);
              })
              .catch((error) => {
                console.error("Error getting audio download URL: ", error);
                reject(error);
              });
          }
        );
      });
  
      uploadTasks.push(audioUploadPromise);
    }
  
 
    Promise.all(uploadTasks)
      .then((downloadURLs) => {
        const [pdfDownloadURL, audioDownloadURL] = downloadURLs;

      })
      .catch((error) => {
        console.error("Error uploading files: ", error);
   
      });
  };

  const extractTextFromPdf = (file) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

      let pdfText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        textContent.items.forEach((textItem) => {
          pdfText += textItem.str + " ";
        });
      }

      setTextFromPdf(pdfText);
    };

    reader.onerror = (event) => {
      setError("Error reading PDF file:", event);
      setErrorText("Error reading PDF file.");
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSave = () => {
    if (!subButtonName) {
      setErrorname('Please input a sub button name.');
      return;
    }
    if (!ButtonName) {
      setErrornamebut('Please input a button name.');
      return;
    }
    if (!downloadUrl) {
      setErrorpdf('Upload a pdf file');
      return;
    }
    if (!textFromPdf) {
        setErrorpdf('Upload a pdf file');
        return;
      }
    if (!selectedFile ) {
      // Display error message for missing PDF file
      setErrorpdf('Please upload a PDF file');
      return;
    }
    if (subButtonName && selectedFile) {
      handleClose();
    }
    
    let layout = 0;

    if (selectedFile && selectedAudio) {
      layout = 1;
    } else if (selectedFile && !selectedAudio && downloadable) {
      layout = 2;
    } else if (selectedFile && !selectedAudio && !downloadable) {
      layout = 3;
    }

    const audioLink = audioDownloadUrl || "";
    onSave({
      ButtonName: ButtonName,
      subButtonName: subButtonName,
      layout: layout,
      content: textFromPdf,
      audio: audioLink,
      pdflink: downloadUrl,
    });
    setSelectedFile(null);
    setSelectedAudio(null);
    setUploadProgress(0);
    setDownloadUrl("");
    setAudioDownloadUrl("");
    setTextFromPdf("");
    setErrorText("");
    setFileName('Choose File');
    setAudioName('Choose Audio');
  };
 

  const handleCancel = () => {
    setSelectedFile(null);
    setSelectedAudio(null);
    setUploadProgress(0);
    setDownloadUrl("");
    setAudioDownloadUrl("");
    setTextFromPdf("");
    setErrorText("");
    setFileName('Choose File');
    setAudioName('Choose Audio');

    if (downloadUrl) {
      const storageRef = ref(storage, downloadUrl); 
      deleteObject(storageRef)
        .then(() => {
          setDownloadUrl('');
          setUploadProgress(0);
        })
        .catch((error) => {
          console.error('Error deleting file:', error);
        });
    }

    if (audioDownloadUrl) {
      const audioRef = ref(storage, "Audio/" + selectedAudio.name);
      deleteFile(audioRef);
    }

    setShow(false); 
  };

  const deleteFile = (fileRef) => {
   
    deleteObject(fileRef)
      .then(() => {
        console.log("File deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting file:", error);
      });
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
            backgroundColor: '#1e329c',
            border: 'none',
            borderRadius: '1.25rem 1.25rem 0 0',
          }}
        >
          <h3 style={{ margin: '0', marginLeft: '0.9375rem' }}>
            <span>Add Button</span>
          </h3>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: 'white',
            border: 'none',
            color: 'grey',
            padding: '0.9375rem 2.5rem 0rem 2.5rem',
          }}
        >
          <Form.Group>
            <Form.Label style={{ fontSize: '0.9375rem', margin: '0', marginLeft: '0.3125rem' }}>
            Button Name:
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter button name"
              value={ButtonName}
              onChange={(e) => {
                setButtonName(e.target.value);
                
              }}
              style={{ borderRadius: '0.625rem', borderColor: 'grey' }}
              
            />
            <h6 style={{ color: 'transparent', margin: '0rem 0rem 0rem 0.25rem ', height: '1.25rem' }}>
           {errorb && <h6 style={{ color: 'red' }}>{errorb}</h6>}
    </h6>
             <Form.Label style={{ fontSize: '0.9375rem', margin: '0', marginLeft: '0.3125rem' }}>
            Sub Button Name:
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter button name"
              value={subButtonName}
              onChange={(e) => {
                setSubButtonName(e.target.value);
                
              }}
              style={{ borderRadius: '0.625rem', borderColor: 'grey' }}
            />
            <h6 style={{ color: 'transparent', margin: '0rem 0rem 0rem 0.25rem ', height: '1.25rem' }}>
           {errorn && <h6 style={{ color: 'red' }}>{errorn}</h6>}
    </h6>
    
    <div className={showStyles ? 'div_main' : 'hiddenStyles'}>
    <div className={showStyles ? 'div_second' : 'hiddenStyles'}>
            <Form.Label style={{ fontSize: '0.9375rem', margin: '0', marginLeft: '0.3125rem' }}>
              PDF file
            </Form.Label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: downloadUrl && showDisplaySection ? '85%' : '100%' }}>
  <label
  htmlFor="file-input"
  style={{
    borderRadius: '0.625rem',
    borderColor: 'grey',
    borderStyle: 'solid',
    borderWidth: '1px',
    padding: '4px 8px', // Adjust padding as needed
    cursor: 'pointer', // To show pointer cursor on hover
    height: 'auto',
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    position: 'relative', // Ensure relative positioning for the input
    display: 'flex',
    alignItems: 'center',
  }}
>
  <i className="glyphicon glyphicon-open"></i>&nbsp;
  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{fileName}</span>
  <input
    type="file"
    id="file-input"
    onChange={handleFileChange}
    style={{
      display: 'block',
      position: 'absolute', // Position the input field absolutely
      opacity: 0, // Make it invisible but clickable
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      cursor: 'pointer', // Show pointer cursor when hovering over the label
    }}
    accept=".pdf"
  />
</label>

  </div>
  {downloadUrl && showDisplaySection &&    (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft:'2rem'}}>
  <span
            style={{ cursor: "pointer", color: "#1e329c" }}
            onClick={() => window.open(downloadUrl, "_blank")}
          >
    <FaFilePdf size={30}  />
    </span>
  </div>)}
</div>

        <h6 style={{ color: 'transparent', margin: '0rem 0rem 0rem 0.25rem ', height: '1.25rem' }}>
           {errorf && <h6 style={{ color: 'red' }}>{errorf}</h6>}
    </h6>
     {!downloadable && (
      <Form.Group controlId="formFileDisabled" className="mb-3" style={{ margin:'0px 0px 0px 0px' }}>
      
            <Form.Label style={{ fontSize: '0.9375rem', margin: '0', marginLeft: '0.3125rem' }}>
              Audio file
            </Form.Label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: audioDownloadUrl && showDisplaySection ? '85%' : '100%' }}>
  <label
  htmlFor="audio-input"
  style={{
    borderRadius: '0.625rem',
    borderColor: 'grey',
    borderStyle: 'solid',
    borderWidth: '1px',
    padding: '4px 8px', // Adjust padding as needed
    cursor: 'pointer', // To show pointer cursor on hover
    height: 'auto',
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    position: 'relative', // Ensure relative positioning for the input
    display: 'flex',
    alignItems: 'center',
  }}
>
  <i className="glyphicon glyphicon-open"></i>&nbsp;
  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{AudioName}</span>
  <input
    type="file"
    id="audio-input"
    onChange={handleAudioChange}
    style={{
      display: 'block',
      position: 'absolute', // Position the input field absolutely
      opacity: 0, // Make it invisible but clickable
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      cursor: 'pointer', // Show pointer cursor when hovering over the label
    }}
    accept="audio/mp3"
  />
</label>

  </div>
  {audioDownloadUrl && showDisplaySection &&    (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft:'2rem'}}>
  <span
            style={{ cursor: "pointer", color: "#1e329c" }}
            onClick={() => window.open(audioDownloadUrl, "_blank")}
          ><FaFileAudio size={30}  /></span>
  </div>)}
</div>
        <h6 style={{ color: 'transparent', margin: '0rem 0rem 0rem 0.25rem ', height: '1.25rem' }}>
           {errora && <h6 style={{ color: 'red' }}>{errora}</h6>}
    </h6></Form.Group>)}
    </div>
 
    </div>
    {!selectedAudio && (
      <Form.Group controlId="formDownloadable" className="mb-3"  style={{marginLeft:'1rem'}} >
            <Form.Check style={{
            margin: '0rem',
          }}
              type="checkbox"
              label="Downloadable"
              checked={downloadable}
          onChange={(e) => setDownloadable(e.target.checked)}
            />
          </Form.Group>)}
          <Form.Group className="d-flex justify-content-center align-items-center">
          <Button
            variant="secondary"
            
            onClick={() => {
             
              handleUpload();
              
            }}
            style={stylebtn }
          >
            Upload
          </Button>
          </Form.Group>
          <h6 style={{ color: 'transparent', margin: '0rem 0rem 0rem 0rem ', height: '1.25rem' }}>
          {uploadProgress > 0 && <h6 style={{ color: 'grey' , textAlign: 'center'}}>Upload Progress: {uploadProgress.toFixed(2)}%</h6>}
    </h6>
       
          </Form.Group>
          
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '0 0 1.25rem 1.25rem',
            paddingTop: '0rem',
          }}
          className="d-flex justify-content-center align-items-center"
        >
          <Button
            variant="secondary"
            onClick={() => {
              handleCancel();
              handleClose();
            }}
           
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
            onClick={() => {
              handleSave();
            
            }}
        
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

export default Addmainbtn; 