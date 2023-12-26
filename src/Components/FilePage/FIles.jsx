import React, { useState } from 'react';
import AudioManager from './audio';
import StudentManager from './storagee';

function File() {
  const [showContentEditor, setShowContentEditor] = useState(true);

  const handleTriviaClick = () => {
    setShowContentEditor(false);
  };

  const handleHandbookClick = () => {
    setShowContentEditor(true);
  };
  return (
    <div className="content-wrapper" style={{ background: 'white' }}>
      <div className="">
        <div style={{ marginBottom: '30px', background: 'white' }}>
          <h1 className='font-weight-bold'>Storage</h1>
          <div className="row row-cols-2 row-cols-md-2 g-4">
            <div  className='col' style={{ textAlign: 'center' }} >
            <h3>
              <a
                href="#handbook"
                onClick={handleHandbookClick}
                style={{
                  margin: '0 30px',
                  fontSize: '18px',
                  textDecoration:  'none',
                  color: showContentEditor ? '#24549A' : 'black',
                  fontWeight: 'bold',
                  paddingBottom: '7px', // Adjust this value for the underline offset
                  borderBottom: showContentEditor ? '3px solid #24549A' : 'none',
                }}
              >
                Pdf
              </a></h3></div>
              <div  className='col' style={{ textAlign: 'center' }}>
            <h3>
              <a
                href="#trivia"
                onClick={handleTriviaClick}
                style={{
                  margin: '0 30px',
                  fontSize: '18px',
                  textDecoration: 'none',
                  color: !showContentEditor ? '#24549A' : 'black',
                  fontWeight: 'bold',
                  paddingBottom: '7px', // Adjust this value for the underline offset
                  borderBottom: !showContentEditor ? '3px solid #24549A' : 'none',
                }}
              >
                Audio
                </a></h3></div>
            
            <hr style={{ marginTop: '0px', width: '90%', margin: 'auto', height:'2px', border: '1px solid #24549A' }} />
          </div>
        </div>

        <div className="content">
          {showContentEditor ? <StudentManager /> : <AudioManager />}
        </div>
      </div>
    </div>
  );
}


export default File;