import React, {useState, useEffect} from 'react'
import logo from '../../../Saint-Gobain_SEFPRO_logo_2023.png';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function SupUsers() {
  const [data, setData] = useState([]);
  //const [updatedUserData, setUpdatedUserData] = useState({});
  //const [isDeleting, setIsDeleting] = useState(false);
  
  
  
  useEffect(() => {
    axios.get('http://localhost:5000/data')
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  }, []);

  
     
 
  
  const navigate = useNavigate();

  const navigateToFileupload = () => {
    //  navigate 
    navigate('/SupFileUpload');
  };

  const navigateToPlanning = () => {
    navigate('/SupPlanning');
  }

  const navigateToSlicing =() => {
    navigate('/Suplicing');
  }

  const navigateToBook = () => {
    navigate('/SupBook')
  }
  const navigateToDashboard=() =>{
    navigate('/SupDashboard')
  }

  const navigateToArea=() =>{
    navigate('/SupViewerArea')
  }
const navigateToCustomers=() => {
  navigate('/SupCustomerDashboard')
}
const [showNav, setShowNav] = useState(false);
  
  const handleMouseEnter = () => {
    setShowNav(true);
  };
  
  const handleMouseLeave = () => {
    setShowNav(false);
  };
  const [showDialog, setShowDialog] = useState(false);
  const openDialog = () => {
    navigate('/');
    };
const closeDialog = () => {
  setShowDialog(false);
};
  return (
    <div className="Container">
      <div className="Header" style={{ display: 'flex' }}>
        <div className="pages">
          <img src={logo} alt="logo" style={{ width: '200px', height: '50px' }} />
        </div>
        <div className="pages">
          <p className='headerText' onClick={navigateToDashboard}>Home</p>
        </div>
        <div className="pages">
            <p className='home' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}   style={{ color: 'hsl(180.3deg 100% 39.02%)' }}>New Plan </p>
            <div className ="Nav" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}  style={{ display: showNav ? 'block' : 'none' }}>
            <div  className="Navbar"onClick={navigateToPlanning}>Plan</div>
            <div className="Navbar"onClick ={navigateToFileupload}>File Upload</div>
            <div className="Navbar"onClick={navigateToSlicing}>Slice</div>
            <div className="Navbar"onClick={navigateToBook}>Book</div>
            <div className="Navbar"onClick={navigateToArea}>View</div>
          </div>
          </div>
       
        <div className="pages">
          <p className='headerText'>Users</p>
        </div>
        <div className="pages">
          <p className='headerText' onClick={navigateToCustomers}>Customers</p>
        </div>
       
        <div className="logout" onClick={() => setShowDialog(true)} style={{marginLeft:'15%'}}>
            
          Logout
        </div>
      </div>
    
      {showDialog && (
      <div className="dialog2">
        <label className='confirmLogout2'>Confirm Logout</label>
        <div className='buttons2'>
        <button onClick={openDialog}>YES</button>
        <button className='yesbtn2' onClick={closeDialog}>NO</button>
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
           
          </tr>
        </thead>
     
        <tbody>
          {data.map((item) => (
            <tr key={item.UserID}>
              <td>{item.UserID}</td>
              <td>{item.UserName}</td>
              <td>{item.UserType}</td>
              <td style={{ width: '20%', color: item.Status === 'ACTIVE' ? 'green' : 'red' }}>{item.Status}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SupUsers;