import React, { useState, useEffect, useRef } from 'react';
import logo from './../src/Saint-Gobain_SEFPRO_logo_2023.png';
import { useNavigate } from 'react-router-dom';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Area() {
  // State variables
  const [plants, setPlants] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedAreaNumber, setSelectedAreaNumber] = useState(null);
  const [selectedAreaData, setSelectedAreaData] = useState(null);
  const [isAreaContentVisible, setIsAreaContentVisible] = useState(false);
  const padsDivRef = useRef(null);
  const [tilePos, setTilepos] = useState([]);
  const [startDate, setStartdate] = useState('');
  const [endDate, setEnddate] = useState('');

  // React Router navigation hook
  const navigate = useNavigate();

  // Show/hide navigation dropdown
  const [showNav, setShowNav] = useState(false);

  // Close the area content
  const handleAreaClose = () => {
    setIsAreaContentVisible(false);
  };

  // Navigate to the dashboard
  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  // Navigate to the login page
  const navigateToLogin = () => {
    navigate('/');
  };

  // Handle mouse enter for showing navigation dropdown
  const handleMouseEnter = () => {
    setShowNav(true);
  };

  // Handle mouse leave to hide navigation dropdown
  const handleMouseLeave = () => {
    setShowNav(false);
  };

  // Fetch plants data from the API
  useEffect(() => {
    console.log("Fetching plants data...");
    fetch(`http://localhost:5000/api/plants`)
      .then(response => response.json())
      .then(data => {
        setPlants(data);
      })
      .catch(error => {
        console.error('Error fetching plants data:', error);
      });
  }, []);

  // Fetch areas data from the API
  useEffect(() => {
    console.log("Fetching areas data...");
    fetch(`http://localhost:5000/api/areas`)
      .then(response => response.json())
      .then(data => {
        setAreas(data);
      })
      .catch(error => {
        console.error('Error fetching areas data:', error);
      });
  }, []);

  // Handle click on an area
  const handleAreaClick = (areaNumber) => {
    setSelectedAreaNumber(areaNumber);
    // Fetch data for the selected area
    fetch(`http://localhost:5000/api/area/${areaNumber}`)
      .then(response => response.json())
      .then(data => {
        setSelectedAreaData(data);
        setIsAreaContentVisible(true);
      })
      .catch(error => {
        console.error('Error fetching area data:', error);
      });
  };

  // Fetch tile position data based on start and end dates
  useEffect(() => {
    console.log("Fetching tile position data...");
    fetch(`http://localhost:5000/api/position?start_date=${startDate}&end_date=${endDate}`)
      .then(response => response.json())
      .then(data => {
        setTilepos(data);
      })
      .catch(error => {
        console.error('Error fetching tile position data:', error);
      });
  }, [startDate, endDate]);

  // Navigate to the file upload page
  const navigateToFileupload = () => {
    navigate('/fileUpload');
  };

  // Navigate to the planning page
  const navigateToPlanning = () => {
    navigate('/Planning');
  };

  // Navigate to the slicing page
  const navigateToSlicing = () => {
    navigate('/slicing');
  };

  // Navigate to the book page
  const navigateToBook = () => {
    navigate('/bookPage');
  };

  // Navigate to the viewer area
  const navigateToView = () => {
    navigate('/viewerArea');
  };

  return (
    <div style={{ padding: '8px' }}>
      {/* Header */}
      <div className="Header" style={{ display: 'flex' }}>
        <div className="pages">
          <img src={logo} alt="logo" style={{ width: '200px', height: '50px' }} />
        </div>
        <div className="pages">
          <p className='headerText' onClick={navigateToDashboard}>Home</p>
        </div>
        <div className="pages">
          <p className='home' onMouseEnter={handleMouseEnter} style={{ color: 'hsl(180.3deg 100% 39.02%)' }}>New Plan</p>
          <div className="Nav" onMouseLeave={handleMouseLeave} style={{ display: showNav ? 'block' : 'none' }}>
            <div className="Navbar" onClick={navigateToPlanning}>Plan</div>
            <div className="Navbar" onClick={navigateToFileupload}>File Upload</div>
            <div className="Navbar" onClick={navigateToSlicing}>Slice</div>
            <div className="Navbar" onClick={navigateToBook}>Book</div>
            <div className="Navbar" onClick={navigateToView}>View</div>
          </div>
        </div>
        <div className="pages">
          <p className='headerText'>Track Progress</p>
        </div>
        <div className="pages">
          <p className='home'>Users</p>
        </div>
        <div className="pages">
          <p className='headerText'>Customers</p>
        </div>
        <div className="logout" style={{ marginLeft: '15%' }} onClick={navigateToLogin}>
          Logout
        </div>
      </div>
      <div style={{ display: 'flex', marginTop: '2%' }}>
        <div style={{ marginLeft: '10%' }}>
          <label style={{ color: 'white' }}>Start Date</label>
          <input type="date" placeholder="Start Date" value={startDate} onChange={e => setStartdate(e.target.value)} /><br />
        </div>
        <div style={{ marginLeft: '10%' }}>
          <label style={{ color: 'white' }}>End Date</label>
          <input type="date" placeholder="End Date" value={endDate} onChange={e => setEnddate(e.target.value)} />
        </div>
      </div>
      <div style={{ backgroundColor: 'white', width: '98%', height: '75vh', marginTop: '3%', padding: '1%', display: 'flex', textAlign: 'center' }}>
        {/* Render plants and areas */}
        {plants.map((plant, index) => (
          <div
            key={index}
            style={{
              border: '1px solid black',
              padding: '8px',
              margin: '20px',
              width: '300px',
              height: '250px',
              cursor: 'pointer',
            }}
          >
            <p>Plant Number: {plant.plant_number}</p>
            {areas
              .filter(area => area.plant_number === plant.plant_number)
              .map((area, index) => (
                <div
                  key={index}
                  style={{
                    border: '1px solid black',
                    margin: '4px',
                    padding: '4px',
                    backgroundColor: 'lightgray',
                  }}
                  onClick={() => handleAreaClick(area.area_number)}
                >
                  <p> {area.area_number}</p>
                  <p>Length: {area.length}</p>
                  <p>Breadth: {area.breadth}</p>
                </div>
              ))}
          </div>
        ))}
      </div>
      <div>
      </div>
      <div>
        {/* Display the selected area content */}
        {selectedAreaData && isAreaContentVisible && (
          <div id={`area-${selectedAreaNumber}-content`} className="area-content" style={{ position: 'fixed', top: '50%', left: '45%', transform: 'translate(-50%, -50%)', background: '#D0E7D2', zIndex: 999, padding: '20px' }}>
            <FontAwesomeIcon icon={faTimes} style={{ padding: '0px', cursor: 'pointer' }} onClick={handleAreaClose} />
            <p style={{ textAlign: 'center' }}>Area Number:{selectedAreaNumber}</p>
            <div className="pads" ref={padsDivRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
              {selectedAreaNumber && tilePos.length > 0 && (
                <div>
                  {tilePos
                    .filter((item) => item.area_number === selectedAreaNumber)
                    .map((item) => (
                      <div
                        key={item.id}
                        style={{
                          position: 'absolute',
                          left: `${item.x}px`, // Adjust based on your grid unit size
                          top: `${item.y}px`,
                          width: `${item.occ_length / 50}px`, // Set your width
                          height: `${item.occ_breadth / 50}px`, // Set your height
                          background: 'red',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textAlign: 'center'
                        }}
                      >
                        {<div
                          key={item.id}
                          style={{
                            position: 'absolute',
                            width: `${item.foot_length / 50}px`, // Set your width
                            height: `${item.foot_breadth / 50}px`, // Set your height
                            background: item.color,
                          }}
                        >
                          <p>{item.customer_name}<br />{item.slice_name}<br />{item.occ_length}*{item.occ_breadth}*{item.height}</p>
                        </div>}
                      </div>
                    ))}
                </div>
              )}
              {/* Render grid of pads */}
              {Array.from({ length: selectedAreaData.rows }).map((_, i) => (
                <div key={i} style={{ display: 'flex' }}>
                  {Array.from({ length: selectedAreaData.columns }).map((_, j) => (
                    <div
                      key={j}
                      style={{
                        width: `${(selectedAreaData.pad_length) * 20}px`,
                        height: `${(selectedAreaData.pad_breadth) * 20}px`,
                        background: '#186F65',
                        marginRight: j < selectedAreaData.columns - 1 ? `${(75 / 1000) * 20}px` : '0px',
                        marginBottom: i < selectedAreaData.rows - 1 ? `${(75 / 1000) * 20}px` : '0px',
                      }}
                    >
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Area;
