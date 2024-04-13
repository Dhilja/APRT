import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './UserTable.css'

function UserTable() {
  const [data, setData] = useState([]);
  //const [updatedUserData, setUpdatedUserData] = useState({});
  //const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('ACTIVE');
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false); // For changing user status 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // For changing user details
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // For confirming user deletion
  const [userToDelete, setUserToDelete] = useState(null); // To store the user to be deleted
  const [isAlert,setIsAlertOpen]=useState(false);// State to control the visibility of the modal
  const [isStatusUpdatedAlertOpen, setIsStatusUpdatedAlertOpen] = useState(false); // For displaying status updated alert
  const [statusUpdatedMessage, setStatusUpdatedMessage] = useState(''); // Message for status updated alert
  const [editUserData, setEditUserData] = useState({}); // Define state for edit user data
  const [showPassword, setShowPassword] = useState(false); // State to control password visibility

  useEffect(() => {
    axios.get('http://localhost:5000/data')
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const handleOpenChangeStatusModal = (userID) => {
    setSelectedUserID(userID);
    setIsChangeStatusModalOpen(true);
  };

  const handleCloseChangeStatusModal = () => {
    setIsChangeStatusModalOpen(false);
  };

  const handleStatusSave = () => {
    axios
      .put(`http://localhost:5000/api/users/${selectedUserID}`, { status: newStatus })
      .then((response) => {
        console.log('Status changed:', response.data,newStatus);
        setStatusUpdatedMessage('Status updated successfully'); // Set the message for the status updated alert
        setIsStatusUpdatedAlertOpen(true);
        setIsChangeStatusModalOpen(false);

        // Update the user's status in the 'data' state
        setData((prevData) =>
          prevData.map((user) => {
            if (user.UserID === selectedUserID) {
              return { ...user, Status: newStatus };
            }
            return user;
          })
        );
      })
      .catch((error) => {
        console.error(error);
        setIsChangeStatusModalOpen(false);
      });
  };

  const handleOpenEditModal = (userID) => {
    setSelectedUserID(userID);
    // Fetch user details based on userID
    axios.get(`http://localhost:5000/api/users/${userID}`)
      .then(response => {
        const userData = response.data[0];
        setEditUserData(userData);
        setIsEditModalOpen(true);
      })
      .catch(error => console.error(error));
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

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
    const UserID = document.getElementById('UserIDInput').value;
    const UserName = document.getElementById('UserNameInput').value;
    const Role = document.getElementById('RoleInput').value;
    const Email = document.getElementById('EmailInput').value;
    const Password = document.getElementById('PasswordInput').value;

    axios.post('http://localhost:5000/api/users', { UserID, UserName, Role, Email, Password })
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

  const handleCloseStatusUpdatedAlert = () => {
    setIsStatusUpdatedAlertOpen(false);
  };

  const handleSaveEdit = () => {
    axios.put(`http://localhost:5000/api/dataEdit/${editUserData.UserID}`, editUserData)
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
      axios.delete(`http://localhost:5000/api/dataDelete/${userToDelete}`)
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
    }
  };

  return (
    <div>
      <div className="newpad" style={{ display: 'flex', justifyContent: 'flex-end',marginTop:"2%"}} >
        <button  onClick={handleOpenModal} >Add User</button>
       </div>

       {isModalOpen && (
        <div className="custom-modal2">
          <div className="modal-content2">
            <h2>Add a new User</h2>
            <div style={{textAlign:'center'}} >
          
              <input className="modal-box2" type="text" placeholder="UserID" id="UserIDInput" style={{width:'80%'}} /><br/>
              <input className="modal-box2" type="text" placeholder="UserName"  id="UserNameInput" style={{width:'80%'}}/><br/>
              <select className="modal-box2" id="RoleInput" style={{width:'88%'}}>
                <option value="Admin">Admin</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Viewer">Viewer</option>
              </select><br/>
              <input className="modal-box2" type="email" placeholder="email" id="EmailInput" style={{width:'80%'}} /><br/>
              <input className="modal-box2" type="password" placeholder="Password" id="PasswordInput" style={{width:'80%'}} /><br/>
              <div className="create-cancel1" style={{marginTop:'7%'}}>
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
           <h3>New User added</h3>
           <button onClick={handleSubmit}>OK</button> 
            </div>
            </div>
      )}

      {isChangeStatusModalOpen && (
        // Change status modal
        <div className="custom-modal2">
          <div className="modal-content2">
            <h2>Change User Status</h2>
            <div style={{ textAlign: 'center' }}>
              <select className='addUserBtn2' value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              <div className="create-cancel2" style={{ marginTop: '7%' }}>
                <button className='addUserBtn2' onClick={handleStatusSave}>Save</button>
                <button className='addUserBtn2' onClick={handleCloseChangeStatusModal} style={{ marginLeft: '8%' }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isStatusUpdatedAlertOpen && (
        <div className="custom-modal2">
          <div className="modal-content2">
            <h3>{statusUpdatedMessage}</h3>
            <button onClick={handleCloseStatusUpdatedAlert}>OK</button>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="custom-modal2">
          <div className="modal-content2">
            <h2>Edit User</h2>
            <div style={{ textAlign: 'center' }}>
              <input className="modal-box2" type="text" placeholder="UserID" value={editUserData.UserID} readOnly /><br />
              <input className="modal-box2" type="text" placeholder="UserName" value={editUserData.UserName} onChange={(e) => setEditUserData({ ...editUserData, UserName: e.target.value })} /><br />
              <select className="modal-box2" style={{width:'88%'}}value={editUserData.UserType} onChange={(e) => setEditUserData({ ...editUserData, UserType: e.target.value })}>
                <option value="Admin">Admin</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Viewer">Viewer</option>
              </select><br />
              <input className="modal-box2" type="email" placeholder="email" value={editUserData.UserEmail} onChange={(e) => setEditUserData({ ...editUserData, UserEmail: e.target.value })} /><br />
              <input className="modal-box2" type={showPassword ? 'text' : 'password'} placeholder="Password" value={editUserData.UserPassword} onChange={(e) => setEditUserData({ ...editUserData, UserPassword: e.target.value })} /><br />
              {/* Button to toggle password visibility */}
              <button className='addUserBtn2' onClick={togglePasswordVisibility}>{showPassword ? 'Hide Password' : 'Show Password'}</button><br />
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
            <h2>Delete User</h2>
            <p>Are you sure you want to delete this user?</p>
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
            <th style={{ width: '20%' }}>UserID</th>
            <th style={{ width: '20%' }}>UserName</th>
            <th style={{ width: '20%' }}>Role</th>
            <th style={{ width: '20%' }}>Status</th>
            <th style={{ width: '20%' }}>Options</th>
          </tr>
        </thead>
     
        <tbody>
          {data.map((item) => (
            <tr key={item.UserID}>
              <td>{item.UserID}</td>
              <td>{item.UserName}</td>
              <td>{item.UserType}</td>
              <td style={{ width: '20%', color: item.Status === 'ACTIVE' ? 'green' : 'red' }}>{item.Status}</td>
              <td>
                <button className='addUserBtn2' onClick={() => handleOpenChangeStatusModal(item.UserID)}>Status</button>
                <button className='addUserBtn2' onClick={() => handleOpenEditModal(item.UserID)} style={{ marginLeft: '10px' }}>Edit</button>
                <button className='addUserBtn2' onClick={() => handleOpenDeleteModal(item.UserID)} style={{ marginLeft: '10px' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable