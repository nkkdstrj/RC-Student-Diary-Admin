import React, { useState } from 'react';
import Trivia from '../content/trivia';
// import FileDisplay from '../files/storage';
import ContentEditor from '../content/contenteditor';

function Content() {
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
          <h2>Content</h2>
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
                Handbook
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
                Trivia
                </a></h3></div>
            
            <hr style={{ marginTop: '-8px', width: '90%', margin: 'auto', height:'2px', border: '1px solid #24549A' }} />
          </div>
        </div>

        <div className="content">
          {showContentEditor ? <ContentEditor /> : <Trivia />}
        </div>
      </div>
    </div>
  );
}

export default Content;
