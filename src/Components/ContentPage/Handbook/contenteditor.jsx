import { get, getDatabase, ref, remove, update } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import Addmainbtn from './addmainbtn';
import Addsubbtn from './addsubbtn';
import "./addsubbtn.css";
import './content.css';
import Editmain from './editmain';
import Editsubbtn from './editsubbtn';
import Maindel from './maindel';
import Subdel from './subdel';
const ContentEditor = () => {
  const [buttonData, setButtonData] = useState(null);
  const [expandedButtons, setExpandedButtons] = useState({});
  const [editedButtonName, setEditedButtonName] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [fileUploadButtonKey, setFileUploadButtonKey] = useState(null);
  const [errorText, setErrorText] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickInsideDropdown = (event) => {
    // Prevent event propagation to the parent element
    event.stopPropagation();
    // Your logic for handling the click inside the dropdown
    // ...
  };
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
  useEffect(() => {
   

    fetchData();
  }, []);

  const toggleExpand = (buttonKey) => {
    setExpandedButtons((prevExpanded) => ({
      ...prevExpanded,
      [buttonKey]: !prevExpanded[buttonKey],
    }));
  };

  const handleArrange = async (index) => {
    const keys = Object.keys(buttonData);
    if (index < keys.length - 1) {
      const buttonKey1 = keys[index];
      const buttonKey2 = keys[index + 1];
  
      const db = getDatabase();
      const buttonRef1 = ref(db, `diarycontent_btn/${buttonKey1}`);
      const buttonRef2 = ref(db, `diarycontent_btn/${buttonKey2}`);
  
      try {
        const snapshot1 = await get(buttonRef1);
        const snapshot2 = await get(buttonRef2);
  
        const buttonData1 = snapshot1.val();
        const buttonData2 = snapshot2.val();
  
        // Update the Firebase database with swapped content
        await update(buttonRef1, buttonData2);
        await update(buttonRef2, buttonData1);
  
        // Fetch the updated data after swapping
        const updatedSnapshot = await get(ref(db, 'diarycontent_btn'));
        const updatedData = updatedSnapshot.val();
        setButtonData(updatedData);
      } catch (error) {
        console.error('Error arranging buttons:', error);
      }
    } else {
      console.log('Cannot arrange the last button');
    }
  };
  // Define a new function to handle the deletion of sub-buttons
  const handleDeleteSubButton = async (buttonKey, subButtonKey) => {
    try {
      const db = getDatabase();
      const subButtonRefToDelete = ref(db, `diarycontent_btn/${buttonKey}/btn_sub_btns/${subButtonKey}`);
      await remove(subButtonRefToDelete);
  
      // Fetch the current sub-buttons data for the button
      const buttonRef = ref(db, `diarycontent_btn/${buttonKey}/btn_sub_btns`);
      const snapshot = await get(buttonRef);
      const subButtonsData = snapshot.val();
  
      // Remove the deleted sub-button from the data
      const updatedSubButtons = { ...subButtonsData };
      delete updatedSubButtons[subButtonKey];
  
      // Reorganize keys to maintain order with proper numbering
      let reorganizedSubButtons = {};
      let count = 1;
      Object.keys(updatedSubButtons).forEach((key) => {
        const newKey = `sub_btn_${count.toString().padStart(3, '0')}`;
        reorganizedSubButtons[newKey] = updatedSubButtons[key];
        count++;
      });
  
      // Update the Firebase database with the reordered sub-buttons
      await update(buttonRef, reorganizedSubButtons);
      const lastButtonKey = `sub_btn_${(count).toString().padStart(3, '0')}`;
      const lastButtonRef = ref(db, `diarycontent_btn/${buttonKey}/btn_sub_btns/${lastButtonKey}`);
      await remove(lastButtonRef);
      // Update buttonData state with the updated sub-buttons data
      setButtonData(prevData => ({
        ...prevData,
        [buttonKey]: {
          ...prevData[buttonKey],
          btn_sub_btns: reorganizedSubButtons
        }
      }));
    } catch (error) {
      console.error('Error deleting sub-button:', error);
    }
  };
  
  const handleArrangeup = async (index) => {
    const keys = Object.keys(buttonData);
    if (index < keys.length + 1) {
      const buttonKey1 = keys[index];
      const buttonKey2 = keys[index - 1];
  
      const db = getDatabase();
      const buttonRef1 = ref(db, `diarycontent_btn/${buttonKey1}`);
      const buttonRef2 = ref(db, `diarycontent_btn/${buttonKey2}`);
  
      try {
        const snapshot1 = await get(buttonRef1);
        const snapshot2 = await get(buttonRef2);
  
        const buttonData1 = snapshot1.val();
        const buttonData2 = snapshot2.val();
  
        // Update the Firebase database with swapped content
        await update(buttonRef1, buttonData2);
        await update(buttonRef2, buttonData1);
  
        // Fetch the updated data after swapping
        const updatedSnapshot = await get(ref(db, 'diarycontent_btn'));
        const updatedData = updatedSnapshot.val();
        setButtonData(updatedData);
      } catch (error) {
        console.error('Error arranging buttons:', error);
      }
    } else {
      console.log('Cannot arrange the last button');
    }
  };
  
  
  const handleArrangeSubButton = async (buttonKey, subButtonIndex) => {
    try {
      const db = getDatabase();
      const buttonRef = ref(db, `diarycontent_btn/${buttonKey}/btn_sub_btns`);
      const snapshot = await get(buttonRef);
      const subButtons = snapshot.val();
  
      const subButtonKeys = Object.keys(subButtons);
      const currentSubButtonKey = subButtonKeys[subButtonIndex];
      
      // Check if subButtonIndex is not at the last position
      if (subButtonIndex < subButtonKeys.length - 1) {
        const nextSubButtonKey = subButtonKeys[subButtonIndex + 1];
  
        // Swap content between the two sub-buttons
        const currentSubButtonContent = { ...subButtons[currentSubButtonKey] };
        subButtons[currentSubButtonKey] = { ...subButtons[nextSubButtonKey] };
        subButtons[nextSubButtonKey] = currentSubButtonContent;
  
        await update(buttonRef, subButtons);
  
        const updatedSnapshot = await get(ref(db, `diarycontent_btn/${buttonKey}/btn_sub_btns`));
        const updatedSubButtons = updatedSnapshot.val();
  
        // Update buttonData state with the updated sub-buttons data
        setButtonData(prevData => ({
          ...prevData,
          [buttonKey]: {
            ...prevData[buttonKey],
            btn_sub_btns: updatedSubButtons
          }
        }));
      } else {
        console.log('The subButtonIndex is at the last position.');
        // Handle this scenario as needed
      }
    } catch (error) {
      console.error('Error arranging sub-buttons:', error);
    }
  };
  
  
  const handleArrangeSubButtonn = async (buttonKey, subButtonIndex) => {
    try {
      const db = getDatabase();
      const buttonRef = ref(db, `diarycontent_btn/${buttonKey}/btn_sub_btns`);
      const snapshot = await get(buttonRef);
      const subButtons = snapshot.val();
  
      const subButtonKeys = Object.keys(subButtons);
      const currentSubButtonKey = subButtonKeys[subButtonIndex];
      
      // Check if subButtonIndex is not at the last position
      if (subButtonIndex > 0) {
        const nextSubButtonKey = subButtonKeys[subButtonIndex - 1];
  
        // Swap content between the two sub-buttons
        const currentSubButtonContent = { ...subButtons[currentSubButtonKey] };
        subButtons[currentSubButtonKey] = { ...subButtons[nextSubButtonKey] };
        subButtons[nextSubButtonKey] = currentSubButtonContent;
  
        await update(buttonRef, subButtons);
  
        const updatedSnapshot = await get(ref(db, `diarycontent_btn/${buttonKey}/btn_sub_btns`));
        const updatedSubButtons = updatedSnapshot.val();
  
        // Update buttonData state with the updated sub-buttons data
        setButtonData(prevData => ({
          ...prevData,
          [buttonKey]: {
            ...prevData[buttonKey],
            btn_sub_btns: updatedSubButtons
          }
        }));
      } else {
        console.log('The subButtonIndex is at the last position.');
        // Handle this scenario as needed
      }
    } catch (error) {
      console.error('Error arranging sub-buttons:', error);
    }
  };


  const handleAddButton = async (data) => {
    const { subButtonName, layout, content, pdflink, audio, subuttonkeyy, buttonkeyy, ButtonName  } = data;
    if (!subButtonName) {
      // Display error message for empty sub button name
      console.error('Please input a sub button name');
      return;
    }
  

    const db = getDatabase();
      const dataRef = ref(db, 'diarycontent_btn');
  
      // Fetch existing buttons to determine the count
      const snapshot = await get(dataRef);
      const existingButtons = snapshot.val();
      const buttonCount = existingButtons ? Object.keys(existingButtons).length : 0;
  
      // Generate key for the new button based on the count
      const newButtonKey = `button_${(buttonCount + 1).toString().padStart(3, '0')}`;
  
      const newButtonRef = ref(db, `diarycontent_btn/${newButtonKey}`);
      await update(newButtonRef, { buttonname: ButtonName });
  
      setButtonData((prevData) => ({
        ...prevData,
        [newButtonKey]: {
          buttonname: ButtonName,
          btn_sub_btns: {},
        },
      }));
    
  
    // Set the new sub-button with the generated key
    const newSubButtonRef = ref(db, `diarycontent_btn/${newButtonKey}/btn_sub_btns/sub_btn_001`);
    await update(newSubButtonRef, {
      sub_btn_name: subButtonName,
      layout: layout,
      content: content,
      pdflink: pdflink,
      audio: audio,
    });
    const updatedSnapshot = await get(ref(db, `diarycontent_btn/${newButtonKey}/btn_sub_btns`));
    const updatedSubButtons = updatedSnapshot.val();

    // Update buttonData state with the updated sub-buttons data
    setButtonData(prevData => ({
      ...prevData,
      [newButtonKey]: {
        ...prevData[newButtonKey],
        btn_sub_btns: updatedSubButtons
      }
    }));
  
  
  };

  const handleAddSubButton = (buttonKey) => {
    setShowFileUpload(true);
    setFileUploadButtonKey(buttonKey);
  };
  const handleCloseFileUpload = () => {
    setShowFileUpload(false);
    setFileUploadButtonKey(null);
  };
  const handleDelete = async (buttonKeyToDelete) => {
    try {
      const db = getDatabase();
      const buttonRefToDelete = ref(db, `diarycontent_btn/${buttonKeyToDelete}`);
      await remove(buttonRefToDelete);
  
      // Fetch the current button data
      const dataRef = ref(db, 'diarycontent_btn');
      const snapshot = await get(dataRef);
      const data = snapshot.val();
  
      // Remove the deleted button from the data
      const newData = { ...data };
      delete newData[buttonKeyToDelete];
  
      // Reorganize keys to maintain order with proper numbering
      let reorganizedData = {};
      let count = 1;
      Object.keys(newData).forEach((key) => {
        const newKey = `button_${count.toString().padStart(3, '0')}`;
        reorganizedData[newKey] = newData[key];
        count++;
      });
  
      // Update the entire diarycontent_btn with the reordered data
      await update(ref(db, 'diarycontent_btn'), reorganizedData);
  
      // Delete the last button after reordering
      const lastButtonKey = `button_${(count).toString().padStart(3, '0')}`;
      const lastButtonRef = ref(db, `diarycontent_btn/${lastButtonKey}`);
      await remove(lastButtonRef);
  
      // Update the local state with the reordered data
      setButtonData(reorganizedData);
      setEditMode(null); // Exit edit mode if necessary
    } catch (error) {
      console.error('Error deleting, reordering, and removing last button:', error);
    }
  };
  
  
  const handleFileUploadSave = async (data) => {
    const { subButtonName, layout, content, pdflink, audio,  } = data;
    if (!subButtonName) {
      // Display error message for empty sub button name
      console.error('Please input a sub button name');
      return;
    }
  
    if (!pdflink) {
      // Display error message for missing PDF file
      console.error('Please upload a PDF file');
      return;
    }
    const db = getDatabase();
    const buttonRef = ref(db, `diarycontent_btn/${fileUploadButtonKey}/btn_sub_btns`);
  
    // Fetch existing sub-buttons to determine the count
    const snapshot = await get(buttonRef);
    const existingSubButtons = snapshot.val();
    const subButtonCount = existingSubButtons ? Object.keys(existingSubButtons).length : 0;
  
    // Generate key for the new sub-button based on the count
    const subButtonKey = `sub_btn_${(subButtonCount + 1).toString().padStart(3, '0')}`;
  
    // Set the new sub-button with the generated key
    const newSubButtonRef = ref(db, `diarycontent_btn/${fileUploadButtonKey}/btn_sub_btns/${subButtonKey}`);
    await update(newSubButtonRef, {
      sub_btn_name: subButtonName,
      layout: layout,
      content: content,
      pdflink: pdflink,
      audio: audio,
    });
    
    const updatedSnapshot = await get(ref(db, `diarycontent_btn/${fileUploadButtonKey}/btn_sub_btns`));
    const updatedSubButtons = updatedSnapshot.val();

    // Update buttonData state with the updated sub-buttons data
    setButtonData(prevData => ({
      ...prevData,
      [fileUploadButtonKey]: {
        ...prevData[fileUploadButtonKey],
        btn_sub_btns: updatedSubButtons
      }
    }));
  
    setErrorText('');
    setShowFileUpload(false);
    setFileUploadButtonKey(null);
  };

  const handleFileUploadSavee = async (data) => {
    const { subButtonName, layout, content, pdflink, audio, subuttonkeyy, buttonkeyy  } = data;
    if (!subButtonName) {
      // Display error message for empty sub button name
      console.error('Please input a sub button name');
      return;
    }
  

    const db = getDatabase();
    
  
    // Set the new sub-button with the generated key
    const newSubButtonRef = ref(db, `diarycontent_btn/${buttonkeyy}/btn_sub_btns/${subuttonkeyy}`);
    await update(newSubButtonRef, {
      sub_btn_name: subButtonName,
      layout: layout,
      content: content,
      pdflink: pdflink,
      audio: audio,
    });
    const updatedSnapshot = await get(ref(db, `diarycontent_btn/${buttonkeyy}/btn_sub_btns`));
    const updatedSubButtons = updatedSnapshot.val();

    // Update buttonData state with the updated sub-buttons data
    setButtonData(prevData => ({
      ...prevData,
      [buttonkeyy]: {
        ...prevData[buttonkeyy],
        btn_sub_btns: updatedSubButtons
      }
    }));
  
  };
  const styleCard = {
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    width: "auto", height: '180px', margin:"20px"
    
  };
  const substyleCard = {
    
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    width: "30rem", margin:"10px",
    border: 'none',
    maxHeight: '300px',
    maxWidth: '50rem',
    overflowY: 'auto',
    
  };
  
  const styleButton = { backgroundColor: "#d1efff", textAlign: "left" };
  
  const styleText = {
    color: "black",
    textAlign: "center",
    fontWeight: "950",
  };
  
  const numStyle = {
    fontSize: "16px",
  };
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const renderButtons = () => {
    if (!buttonData || Object.keys(buttonData).length === 0) {
      return <p>No buttons available.</p>;
    }
    const keys = Object.keys(buttonData);
    return (
      <div className="row row-cols-1 row-cols-md-3 g-4">
         {keys.map((buttonKey, index) => {
        const button = buttonData[buttonKey];
        const subButtons = button.btn_sub_btns || {}; // Ensure btn_sub_btns is defined
        const isExpanded = expandedButtons[buttonKey];
        const isEditing = editMode === buttonKey;
          
         

      return (
       
        <div key={buttonKey} className='col'>
          <div className="card mb-3" style={styleCard}>
          <div className="card-body text-center d-flex justify-content-center align-items-center">
          <div style={{
  width: '100%',
  maxHeight: '100%',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
}}>
                <h5 className="fw-bold" style={{
                
                  margin: '0px',
                  width: '100%',
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
            alignItems:'center',
            textAlign:'center',
                }}>
                  {button.buttonname}
                </h5>
              </div>
  </div>
            <div className="card-footer" style={{ display: 'flex', backgroundColor: 'white', justifyContent: 'space-between' ,}}>
            <div className="col-md-6">
            <div className="dropdown"  >
            
            <button
  onClick={() => toggleExpand(buttonKey)}
  className="btn btn-primary dropdown-toggle"
  data-bs-toggle="dropdown"
  style={{ border: 'none', backgroundColor: 'white', color: 'black' }}
>
  <span style={{ paddingRight: '20px' }}>sub buttons</span>
</button>
                <div key={buttonKey}>
                
                <ul className="dropdown-menu " style={substyleCard}>
                  
                    {Object.keys(subButtons).map((subButtonKey, subButtonIndex) => {
                      const subButton = subButtons[subButtonKey];
                      return (
                            <li  key={subButtonKey} style={{ display: 'flex',  backgroundColor: 'white', ':hover': { backgroundColor: 'white !important' } }} onClick={handleClickInsideDropdown}>
              <button
    onClick={() => handleArrangeSubButton(buttonKey, subButtonIndex)}
    className="btn text-secondary"
    style={{ fontSize: '15px', padding: '0px', marginLeft: '10px' }}
  >
<TiArrowSortedDown />
  </button>            
  <button
    onClick={() => handleArrangeSubButtonn(buttonKey, subButtonIndex)}
    className="btn text-secondary"
    style={{ fontSize: '15px', padding: '0px', marginLeft: '5px' }}
  >
    <TiArrowSortedUp />
  </button>
 

<a style={{color: "inherit", textDecoration:'none',width:'80%'}} href={subButton.pdflink} target="_blank" rel="noopener noreferrer"> <span class="dropdown-item "  style={{  color: 'black',  overflow: 'hidden',
                  textOverflow: 'ellipsis', }}>
  {subButton.sub_btn_name}
</span></a>
                          
                            <Editsubbtn
  onSave={handleFileUploadSavee}
  onClose={handleCloseFileUpload}
  AddSubButton={() => handleAddSubButton(buttonKey)}
  content={subButton.content}
  pdflink={subButton.pdflink}
  audio={subButton.audio}
  layout={subButton.layout}
  subButtonKey={subButtonKey}
  buttonKey={buttonKey}
  initialContent={subButton.content}
  initialPdflink={subButton.pdflink}
  initialAudio={subButton.audio}
  initialLayout={subButton.layout}
  initialSubButtonName={subButton.sub_btn_name}
  initialsubButtonKey={subButtonKey}
  initialbuttonKey={buttonKey}

/>

                          <Subdel handleDelete={() => handleDeleteSubButton(buttonKey, subButtonKey)}/>
                          </li>
                        );
                      })}
                    <Addsubbtn
  onSave={handleFileUploadSave}
  onClose={handleCloseFileUpload}
  AddSubButton={() => handleAddSubButton(buttonKey)}
  handleClickInsideDropdown={handleClickInsideDropdown}
/>
                    </ul>
                 
               </div>
           
              </div></div>
              <div className="col-md-6 d-flex justify-content-end align-items-center">
              <div style={{ position: 'absolute', top: '10px', right: '17px' }}>
          <button onClick={() => handleArrange(index)} className="btn text-secondary"  style={{fontSize: "17px",padding:'0px', marginLeft: '5px' }}>
            <span><TiArrowSortedDown/></span>
          </button>
          <button onClick={() => handleArrangeup(index)} className="btn text-secondary"  style={{fontSize: "17px",padding:'0px', marginLeft: '5px' }}>
            <span><TiArrowSortedUp/></span>
          </button>
        </div>
    <Editmain
      buttonNamee={button.buttonname}
  
      buttonKeyy={buttonKey}
      updateButtonData={fetchData}
      initialbuttonName={button.buttonname}
      initialbuttonKey={buttonKey}
  />
    
<Maindel  handleDelete={() => handleDelete(buttonKey)}/>
    
  </div>


            </div>
          </div></div>
        
        );
      })}
    </div>
  );
};
  
  return (
    <div>
    <Addmainbtn
  onSave={handleAddButton}
  onClose={handleCloseFileUpload}

/>
      {renderButtons()}
      
      
    </div>
    
  );
};

export default ContentEditor;