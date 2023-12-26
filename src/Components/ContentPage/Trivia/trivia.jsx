import { get, getDatabase, ref, remove, update } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import Addtrivia from './addtrivia';
import Triviadel from './triviadel';
import Triviaedit from './triviaedit';
import Triviam from './trivialm';
const Trivia = () => {
  const [buttonData, setButtonData] = useState(null);
  const [expandedButtons, setExpandedButtons] = useState({});
  const [editedButtonName, setEditedButtonName] = useState('');
   const [editMode, setEditMode] = useState(null);
  
  const [errorText, setErrorText] = useState('');
  
  const fetchData = async () => {
    try {
      const db = getDatabase();
      const dataRef = ref(db, 'Trivia');
      const snapshot = await get(dataRef);
  
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('Fetched Data:', data);
        setButtonData(data);
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  

 

  

  const handleAddButton = async (titlecontent) => {
    try {
     
      const db = getDatabase();
      const dataRef = ref(db, 'Trivia');
  
      const snapshot = await get(dataRef);
      const existingButtons = snapshot.val();
      const buttonCount = existingButtons ? Object.keys(existingButtons).length : 0;
  
      const newButtonKey = `T_${(buttonCount + 1).toString().padStart(3, '0')}`;
  
      const newButtonRef = ref(db, `Trivia/${newButtonKey}`);
      await update(newButtonRef, { titleContent: titlecontent });
  
      setButtonData((prevData) => ({
        ...prevData,
        [newButtonKey]: {
            titleContent: titlecontent,
         
        },
      }));
  
      setEditedButtonName(''); // Clear the input
    } catch (error) {
      console.error('Error adding new button:', error);
    }
  };

  const handleDelete = async (buttonKeyToDelete) => {
    try {
      const db = getDatabase();
      const buttonRefToDelete = ref(db, `Trivia/${buttonKeyToDelete}`);
      await remove(buttonRefToDelete);
  
      // Fetch the current button data
      const dataRef = ref(db, 'Trivia');
      const snapshot = await get(dataRef);
      const data = snapshot.val();
  
      // Remove the deleted button from the data
      const newData = { ...data };
      delete newData[buttonKeyToDelete];
  
      // Reorganize keys to maintain order with proper numbering
      let reorganizedData = {};
      let count = 1;
      Object.keys(newData).forEach((key) => {
        const newKey = `T_${count.toString().padStart(3, '0')}`;
        reorganizedData[newKey] = newData[key];
        count++;
      });
  
      // Update the entire diarycontent_btn with the reordered data
      await update(ref(db, 'Trivia'), reorganizedData);
  
      // Delete the last button after reordering
      const lastButtonKey = `T_${(count).toString().padStart(3, '0')}`;
      const lastButtonRef = ref(db, `Trivia/${lastButtonKey}`);
      await remove(lastButtonRef);
  
      // Update the local state with the reordered data
      setButtonData(reorganizedData);
      setEditMode(null); // Exit edit mode if necessary
    } catch (error) {
      console.error('Error deleting, reordering, and removing last button:', error);
    }
  };

  const styleCard = {
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    width: "auto", height: '180px', margin:"20px"
    
  };
  

  const renderButtons = () => {
    if (!buttonData || Object.keys(buttonData).length === 0) {
      return <p>No buttons available.</p>;
    }
  
    const keys = Object.keys(buttonData);
  
    return (
      <div className="row row-cols-1 row-cols-md-3 g-4">
       {keys.map((buttonKey) => {
          const button = buttonData[buttonKey];
  
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
                <p className="fw-bold" style={{
                  fontSize: '12px',
                  margin: '0px',
                  width: '90%',
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
            alignItems:'center',
            textAlign:'center',
                }}>
                  {button.titleContent}
                </p>
              </div>
            </div>
            <div className="card-footer" style={{ backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', position: 'absolute', bottom: 0, width: '100%',border: 'none'  }}>
   <Triviam
   titlecontent={button.titleContent}
   initialTitlecontent={button.titleContent}
   />
    <div style={{ display: 'flex' }}>
    <Triviaedit
  buttonKey={buttonKey}
  titlecontent={button.titleContent}
  initialTitlecontent={button.titleContent}
  updateTriviaData={fetchData} // Pass the function that fetches updated data
/>
    <Triviadel
    key={buttonKey} // Make sure each Triviaedit has a unique key
    buttonKey={buttonKey}
    titlecontent={button.titleContent}
    handleDelete={() => handleDelete(buttonKey)}
  />
    </div>
  </div>
          </div>
        </div>
       
          );
        })}
      </div>
    );
  };
    
    return (
      <div>
      <Addtrivia  handleAddButton={handleAddButton} />
        {renderButtons()}
        
        
      </div>
      
    );
  };
  
  export default Trivia;