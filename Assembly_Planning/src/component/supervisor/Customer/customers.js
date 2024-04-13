import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './customers.css';
import logo from '../../../Saint-Gobain_SEFPRO_logo_2023.png';
import ProgBar from './modelProgBar';
import CustomerTable from './CustomerTable';
import ProgBar2 from './modelProgBar2';
import ProgBar3 from './modelProgBar3';
//import ProgPerc from './ProgPerc';

function SupCustomerDashBoard() {
    const [showDialog, setShowDialog] = useState(false);
    const navigate = useNavigate();
    
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
    const navigateToUsers=() =>{
      navigate('/SupUserDashboard')
    }
    const openDialog = () => {
        navigate('/');
      };
  const closeDialog = () => {
    setShowDialog(false);
  };

  const [showNav, setShowNav] = useState(false);
  
  const handleMouseEnter = () => {
    setShowNav(true);
  };
  
  const handleMouseLeave = () => {
    setShowNav(false);
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
            <p className='headerText' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}   >New Plan </p>
            <div className ="Nav" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}  style={{ display: showNav ? 'block' : 'none' }}>
            <div  className="Navbar"onClick={navigateToPlanning}>Plan</div>
            <div className="Navbar"onClick ={navigateToFileupload}>File Upload</div>
            <div className="Navbar"onClick={navigateToSlicing}>Slice</div>
            <div className="Navbar"onClick={navigateToBook}>Book</div>
            <div className="Navbar" onClick={navigateToArea}>View</div>
            
          </div>
          </div>
        <div className="pages">
          <p className='headerText' onClick={navigateToUsers}>Users</p>
        </div>
        <div className="pages">
        
          <p className='home' style={{ color: '#00C7C8' }}>Customers</p>
        </div>
        <div className="logout" onClick={() => setShowDialog(true)} style={{marginLeft:'15%'}}>
            
          Logout
        </div>
      </div>
      {showDialog && (
      <div className="dialog1">
        <label className='confirmLogout1'>Confirm Logout</label>
        <div className='buttons1'>
        <button onClick={openDialog}>YES</button>
        <button className='yesbtn1' onClick={closeDialog}>NO</button>
        </div>
      </div>
    )}
        <br/>
        <div className='container1'>
            <div className="actblock1">
            <ProgBar/> 
            </div>
            <div className="actblock2">
            <ProgBar2/> 
            </div>
            <div className="actblock3">
            <ProgBar3/> 
            
            </div>
           
            
        </div>
        <br/>
            <div className='ct1' style={{ width: '100%' }}>
            <CustomerTable/>
            </div>
    </div>

    
  );
}

export default SupCustomerDashBoard;