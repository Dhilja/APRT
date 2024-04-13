import React, { useState, useEffect } from 'react';
import './tile.css';
import { useNavigate } from 'react-router-dom';
import logo from '../../../Saint-Gobain_SEFPRO_logo_2023.png';
import ColorTiles from './ColorTiles';
import { useParams } from 'react-router-dom';

function SupTiles() {
    const [showDialog, setShowDialog] = useState(false);
    const navigate = useNavigate();

    const navigateToUsers = () => {
        navigate('/SupUserDashboard');
    };

    const navigateToCustomer = () => {
        navigate('/SupCustomerDashboard');
    };
    const navigateToFileupload = () => {
        navigate('/SupFileUpload');
      };

      const navigateToArea= () => {
        navigate('/SupViewerArea');
      };

      const navigateToBook= () => {
        navigate('/SupBook');
      };
      const navigateToPlanning= () => {
        navigate('/SupPlanning');
      };
      const navigateToSlicing= () => {
        navigate('/SupSlicing');
      };
      const navigateToDashboard= () => {
        navigate('/SupDashboard');
      };
    const openDialog = () => {
        navigate('/');
    };

    const closeDialog = () => {
        setShowDialog(false);
    };

    const { OAN } = useParams();
    console.log(OAN);
    
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
              <p className='home' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}   >New Plan </p>
              <div className ="Nav" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}  style={{ display: showNav ? 'block' : 'none' }}>
              <div  className="Navbar"onClick={navigateToPlanning}>Plan</div>
              <div className="Navbar"onClick ={navigateToFileupload}>File Upload</div>
              <div className="Navbar"onClick={navigateToSlicing}>Slice</div>
              <div className="Navbar"onClick={navigateToBook}>Book</div>
              <div className="Navbar" onClick={navigateToArea}>View</div>
              
            </div>
            </div>
          <div className="pages">
            <p className='headerText'onClick={navigateToUsers} >Users</p>
          </div>
          <div className="pages">
          
            <p className='home' style={{ color: '#00C7C8' }} onClick={navigateToCustomer}>Customers</p>
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
            <div className="view3"></div>
            <div></div>
            <div className="tiles3">
                <ColorTiles OAN={OAN} />
            </div>
        </div>
    );
}

export default SupTiles;
