/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './customerTable.css';
import { useNavigate } from 'react-router-dom';

function CustomerTable() {
  const [data, setData] = useState([]);
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlert,setIsAlertOpen]=useState(false);// State to control the visibility of the modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // For changing user details
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // For confirming user deletion
  const [userToDelete, setUserToDelete] = useState(null); // To store the user to be deleted
  const [editUserData, setEditUserData] = useState({}); // Define state for edit user data

  const navigate = useNavigate();
  
  const handleOANClick = (OAN) => {
    try {
      const tilesURL = `/Admintile/${OAN}`; // Use backticks and /tiles/${OAN}
      // Redirect to the Tiles component with the 'OAN' parameter
      navigate(tilesURL);
    } catch (error) {
      console.error(error);
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleCancel=()=>{
    handleCloseModal();
  };
  
  const handleisAlert = () => {
    handleCloseModal();
    const ClientID = document.getElementById('ClientIDInput').value;
    const ClientName = document.getElementById('ClientNameInput').value;
    const OAN = document.getElementById('OANInput').value;

    axios.post('http://localhost:5000/api/dataClient', { ClientID, ClientName, OAN })
    .then((response) => {
      console.log('Server response:',response.data); // If needed, you can display a success message to the user
      setIsAlertOpen(true);
      window.location.reload();
       // Show the success alert
    })
    .catch((error) => {
      console.log("error occured")
      console.error(error); // Handle any error that occurred during the request
    });
  };

  const handleCloseAlert = () => {
    setIsAlertOpen(false);
  };
  const handleSubmit = () => {
    // Handle form submission here
    handleCloseAlert();
  };

  useEffect(() => {
    axios.get('http://localhost:5000/datacustomer')
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleOpenEditModal = (OAN) => {
    setSelectedUserID(OAN);
    // Fetch user details based on userID
    axios.get(`http://localhost:5000/api/dataEditClient/${OAN}`)
      .then(response => {
        const userData = response.data[0];
        setEditUserData(userData);
        setIsEditModalOpen(true);
      })
      .catch(error => console.error(error));
  };

  const handleSaveEdit = () => {
    axios.put(`http://localhost:5000/api/dataEditCustomer/${editUserData.OAN}`, editUserData)
      .then(response => {
        console.log('User data updated successfully:', response.data);
        setIsEditModalOpen(false); // Close the edit modal after successful update
        // You may want to update the data state with the updated user data
        // Example: You can fetch the updated data again from the backend and set it to the data state
        // Or you can update the corresponding item in the data state with the updated user data
        window.location.reload();
      })
      .catch(error => {
        console.error('Error updating user data:', error);
        // Handle error if necessary
      });
  }; 


  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleOpenDeleteModal = (userID) => {
    setSelectedUserID(userID);
    setUserToDelete(userID);
    setIsDeleteModalOpen(true);
  };
  
  const handleCloseDeleteModal = () => {
    setUserToDelete(null);
    setIsDeleteModalOpen(false);
  };
  
  const handleDeleteUser = () => {
    if (userToDelete) {
      axios.delete(`http://localhost:5000/api/dataDeleteClient/${userToDelete}`)
        .then(response => {
          console.log('User deleted successfully:', response.data);
          setIsDeleteModalOpen(false); 
          setData(prevData => prevData.filter(user => user.UserID !== userToDelete));
          setUserToDelete(null);
        })
        .catch(error => {
          console.error('Error deleting user:', error);
          // Handle error if necessary
        });
        window.location.reload();
    }
  };

  return (
    <div>
      <div className="newUser2" style={{ display: 'flex', justifyContent: 'flex-end',marginTop:"2%"}} >
        <button className='addUserBtn3' onClick={handleOpenModal} >Add Client</button>
       </div>
       {isModalOpen && (
        <div className="custom-modal2">
          <div className="modal-content2">
            <h2>Add a new Customer</h2>
            <div style={{textAlign:'center'}} >
          
              <input className="modal-box2" type="text" placeholder="ClientID" id="ClientIDInput" style={{width:'80%'}} /><br/>
              <input className="modal-box2" type="text" placeholder="ClientName"  id="ClientNameInput" style={{width:'80%'}}/><br/>
              <input className="modal-box2" type="text" placeholder="OAN" id="OANInput" style={{width:'80%'}} /><br/>
              <div className="create-cancel2" style={{marginTop:'7%'}}>
              <button className='addUserBtn2' onClick={handleisAlert}>Create</button>
              <button className='addUserBtn2' onClick={handleCancel} style={{marginLeft:'8%'}}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isAlert && (
           <div className="custom-modal2">
           <div className="modal-content2">
           <h3>New Client added</h3>
           <button onClick={handleSubmit}>OK</button> 
            </div>
            </div>
      )}
      {isEditModalOpen && (
        <div className="custom-modal2">
          <div className="modal-content2">
            <h2>Edit Customer</h2>
            <div style={{ textAlign: 'center' }}>
              <input className="modal-box2" type="text" placeholder="OAN" value={editUserData.OAN} readOnly /><br />
              <input className="modal-box2" type="text" placeholder="ClientID" value={editUserData.ClientID} onChange={(e) => setEditUserData({ ...editUserData, ClientID: e.target.value })} /><br />
              <input className="modal-box2" type="text" placeholder="ClientName" value={editUserData.ClientName} onChange={(e) => setEditUserData({ ...editUserData, ClientName: e.target.value })} /><br />
              <div className="create-cancel2" style={{ marginTop: '7%' }}>
                <button className='addUserBtn2' onClick={handleSaveEdit}>Save</button>
                <button className='addUserBtn2' onClick={handleCloseEditModal} style={{ marginLeft: '8%' }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="custom-modal2">
          <div className="modal-content2">
            <h2>Delete Client</h2>
            <p>Are you sure you want to delete this Client?</p>
            <div className="create-cancel2" style={{ marginTop: '7%' }}>
              <button className='addUserBtn2' onClick={handleDeleteUser}>Yes</button>
              <button className='addUserBtn2' onClick={handleCloseDeleteModal} style={{ marginLeft: '8%' }}>No</button>
            </div>
          </div>
        </div>
      )}

      <table className="user-table2">
        <thead>
          <tr>
            <th style={{ width: '20%' }}>ClientID</th>
            <th style={{ width: '20%' }}>ClientName</th>
            <th style={{ width: '20%' }}>OAN</th>
            <th style={{ width: '20%' }}>Completion Status</th>
            <th style={{ width: '20%' }}>Options</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.ClientID}>
              <td>{item.ClientID}</td>
              <td>{item.ClientName}</td>
              <td>
                <a href="" onClick={() => handleOANClick(item.OAN)}>{item.OAN}</a>
              </td>
              <td>{item.Percentage}%</td>
              <td>
                <button className='addUserBtn2' onClick={() => handleOpenEditModal(item.OAN)} style={{ marginLeft: '10px' }}>Edit</button>
                <button className='addUserBtn2' onClick={() => handleOpenDeleteModal(item.OAN)} style={{ marginLeft: '10px' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerTable;
