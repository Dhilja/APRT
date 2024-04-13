import React, { useState } from 'react';
import axios from 'axios';
import './upload.css';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [clientId, setClientId] = useState('');
  const [OANumber, setOANumber] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleClientIdChange = (e) => {
    setClientId(e.target.value);
  };

  const handleOANumberChange = (e) => {
    setOANumber(e.target.value);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('clientId', clientId);
    formData.append('OANumber', OANumber);

    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File and details submitted successfully!');
    } catch (error) {
      console.error('Error:', error);

  // Check if the error response has data and a specific message
  if (error.response) {
    if (error.response.status === 404) {
      alert('Customer does not exist'); // Customer does not exist
    } else {
      alert('Submission failed');
    }
  } else {
    // Handle cases where the error response is not received (network errors, etc.)
    alert('Submission failed: Network or server error.');
  }
}
  };

  return (
    <div>
      <h1> File Upload</h1>
      <div className="modal-content7">
      <div>
        <label>Enter the client ID:</label>
        <input type="text" className="modal-box7" value={clientId} onChange={handleClientIdChange} />
      </div>
      <div>
        <label>Enter the OA Number:</label>
        <input type="text" className="modal-box7" value={OANumber} onChange={handleOANumberChange} />
      </div>
      </div>
      <br/><br/>
      <input type="file" id='filebutton' onChange={handleFileChange} />
      <br/><br/><br/>
      <button className="logout7" onClick={handleSubmit}>Submit</button>
      
    </div>
  );
}

export default FileUpload;
