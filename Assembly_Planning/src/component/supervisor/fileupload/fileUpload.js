import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './fileUpload.css';
import Upload from './upload';
import logo from '../../../Saint-Gobain_SEFPRO_logo_2023.png';

function SupFileUpload() {
    const [showDialog, setShowDialog] = useState(false);
    const navigate = useNavigate();
    const navigateToCustomer = () => {
      navigate('/SupCustomerDashboard');
    };
    const navigateToUser = () => {
      navigate('/SupUserDashboard');
    };
    const openDialog = () => {
      navigate('/');
      };
  const closeDialog = () => {
    setShowDialog(false);
  };

 

  const navigateToFileupload = () => {
    //  navigate 
    navigate('/SupFileUpload');
  };

  const navigateToPlanning = () => {
    navigate('/SupPlanning');
  }

  const navigateToSlicing =() => {
    navigate('/SupSlicing');
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


  const [showNav, setShowNav] = useState(false);
  
  const handleMouseEnter = () => {
    setShowNav(true);
  };
  
  const handleMouseLeave = () => {
    setShowNav(false);
  };
  


  return (
    <>
    <div className="Container">
      <div className="Header" style={{ display: 'flex' }}>
        <div className="pages">
          <img src={logo} alt="logo" style={{ width: '200px', height: '50px' }} />
        </div>
        <div className="pages">
          <p className='headerText' onClick={navigateToDashboard}>Home</p>
        </div>
        <div className="pages">
            <p className='home' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ color: 'hsl(180.3deg 100% 39.02%)' }}>New Plan </p>
            <div className ="Nav" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}  style={{ display: showNav ? 'block' : 'none' }}>
            <div  className="Navbar"onClick={navigateToPlanning}>Plan</div>
            <div className="Navbar"onClick ={navigateToFileupload}>File Upload</div>
            <div className="Navbar"onClick={navigateToSlicing}>Slice</div>
            <div className="Navbar"onClick={navigateToBook}>Book</div>
            <div className="Navbar"onClick={navigateToArea}>View</div>
          </div>
          </div>
       
        <div className="pages">
          <p className='headerText' onClick={navigateToUser}>Users</p>
        </div>
        <div className="pages">
          <p className='headerText' onClick={navigateToCustomer}>Customers</p>
        </div>
        <div className="logout" style={{ marginLeft: '15%' }} onClick={() => setShowDialog(true)}>
          Logout
        </div>
      </div>
      {showDialog && (
      <div className="dialog5">
        <label className='confirmLogout5'>Confirm Logout</label>
        <div className='buttons5'>
        <button onClick={openDialog}>YES</button>
        <button className='yesbtn5' onClick={closeDialog}>NO</button>
        </div>
      </div>
    )}
      <div className="fileupload5">
          <Upload />
      </div>
    </div> 
    </>
  );
}



export default SupFileUpload;
