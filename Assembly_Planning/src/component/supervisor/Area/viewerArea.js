import React ,{useState,useEffect,useRef} from 'react';
import logo from '../../../Saint-Gobain_SEFPRO_logo_2023.png';
import { useNavigate } from 'react-router-dom';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function SupViewerarea(){

    
   
const [plants,setPlants] = useState([]);
const [areas, setAreas] =useState([]);
const [selectedAreaNumber, setSelectedAreaNumber] = useState(null);
const [selectedAreaData, setSelectedAreaData] = useState(null);
const [isAreaContentVisible, setIsAreaContentVisible] = useState(false);
const padsDivRef = useRef(null);
const [tilePos,setTilepos] = useState([]);
const [startDate ,setStartdate] = useState('');
const [endDate ,setEnddate] = useState('');



const handleAreaClose = () => {
  setIsAreaContentVisible(false);
};

 const navigate = useNavigate();

  

  



  
  

  

  

  
/*for the fetching plant data*/
  useEffect(() => {
    console.log("Fetching plants data...");
    fetch(`http://localhost:5000/api/plants`)
    .then(response => response.json())
    .then(data => {
        console.log('Plants Data:', data);
        setPlants(data);
    })
    .catch(error => {
        console.error('Error fetching sliced parts data:', error);
    });
}, []);

/*for fetching the area data*/
useEffect(() => {
  console.log("Fetching plants data...");
  fetch(`http://localhost:5000/api/areas`)
  .then(response => response.json())
  .then(data => {
      console.log('Plants Data:', data);
      setAreas(data);
  })
  .catch(error => {
      console.error('Error fetching sliced parts data:', error);
  });
}, []);

/*onclick of area to display pad structure*/

const handleAreaClick = (areaNumber) => {
  
  setSelectedAreaNumber(areaNumber);

  fetch(`http://localhost:5000/api/area/${areaNumber}`)
    .then(response => response.json())
    .then(data => {
      console.log('Area Data:', data);
      // Save the fetched data to state for rendering
      setSelectedAreaData(data);
      setIsAreaContentVisible(true);
    })
    .catch(error => {
      console.error('Error fetching area data:', error);
    });
};

/*for displaying products*/

useEffect(() => {
  console.log("Fetching tile position data...");

  // Check if startDate and endDate are valid dates
  if (!startDate || !endDate) {
    console.error('Invalid date values');
    return;
  }

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/position?start_date=${startDate}&end_date=${endDate}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Tile Position Data:', data);
      setTilepos(data);
    } catch (error) {
      console.error('Error fetching tile position data:', error.message);
      // Handle errors more gracefully, e.g., set an error state or display an error message to the user.
    }
  };

  fetchData();
}, [startDate, endDate]);

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

const navigateToUsers=() =>{
  navigate('/SupUserDashboard')
}
const navigateToCustomers=() =>{
  navigate('/SupCustomerDashboard')
}

const [showDialog, setShowDialog] = useState(false);
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
  

    return(
        <div style={{padding:'8px'}}>
             <div className="Header" style={{ display: 'flex' }}>
          <div className="pages">
            <img src={logo} alt="logo" style={{ width: '200px', height: '50px' }} />
          </div>
          <div className="pages">
            <p className='headerText' onClick={navigateToDashboard} >Home</p>
          </div>
          <div className="pages">
            <p className='home' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ color: 'hsl(180.3deg 100% 39.02%)' }}>New Plan </p>
            <div className ="Nav" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}  style={{ display: showNav ? 'block' : 'none' }}>
            <div  className="Navbar"onClick={navigateToPlanning}>Plan</div>
            <div className="Navbar"onClick ={navigateToFileupload}>File Upload</div>
            <div className="Navbar"onClick={navigateToSlicing}>Slice</div>
            <div className="Navbar"onClick={navigateToBook}>Book</div>
            <div className="Navbar">View</div>
          </div>
          </div>
         
          <div className="pages">
            <p className='headerText' onClick={navigateToUsers}>Users</p>
          </div>
          <div className="pages">
            <p className='headerText'  onClick={navigateToCustomers}>Customers</p>
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
      
        <div style={{display:'flex',marginTop:'2%'}}>
            <div style={{marginLeft:'10%'}}>
            <label style={{color:'white'}}>Start Date </label>
              <input type="date"  placeholder="Start Date"value={startDate} onChange= {e=>setStartdate(e.target.value)}  /> <br/>
            </div>
            <div style={{marginLeft:'10%'}}>
            <label style={{color:'white'}}>End Date </label>
              <input type="date" placeholder="End Date"value={endDate} onChange= {e=>setEnddate(e.target.value)}  />
            </div>
             
        </div> 
         
        {/*for displaying plant ,area , apositions of tile */}    


            <div style={{ backgroundColor: 'white', width: '98%', height: '75vh', marginTop: '3%', padding: '1%', display: 'flex',textAlign:'center' }}>
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
      <p>Plant Number : {plant.plant_number}</p>
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

            onClick={()=> handleAreaClick(area.area_number)}
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
  {/*displaying areas */}
{selectedAreaData &&  isAreaContentVisible && (
  <div id={`area-${selectedAreaNumber}-content`} className="area-content" style={{ position: 'fixed', top: '50%', left: '45%', transform: 'translate(-50%, -50%)', background: '#D0E7D2', zIndex: 999 ,padding:'20px'}}>
    <FontAwesomeIcon icon={faTimes} style={{ padding: '0px', cursor: 'pointer' }} onClick={handleAreaClose}  />
    <p style={{textAlign:'center'}}>Area Number:{selectedAreaNumber}</p>
    <div className="pads" ref={padsDivRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
    {/*for displaying the tiles */}
{selectedAreaNumber && tilePos.length > 0 && (
        <div>
          {tilePos
            .filter((item) => item.area_number === selectedAreaNumber)
            .map((item) => (
              <div
                key={item.id}
                style={{
                  position: 'absolute',
                  left: `${item.x }px`, // Adjust based on your grid unit size
                  top: `${item.y}px`,
                  width: `${item.occ_length/50}px`, // Set your width
                  height: `${item.occ_breadth/50}px`, // Set your height
                  background:'red',
                  display:'flex',
                  justifyContent:'center',
                  alignItems:'center',
                  textAlign:'center'
                 
                  
                }}
              >
               

                { <div
                key={item.id}
                style={{
                  position: 'absolute',
                 
                  width: `${item.foot_length/50}px`, // Set your width
                  height: `${item.foot_breadth/50}px`, // Set your height
                  background: item.color,
                 
                 
                }}
              >

                <p style={{fontSize:'70%'}}>{item.customer_name}<br/>{item.slice_name}<br/>{item.occ_length}*{item.occ_breadth}*{item.height}<br/>Inspection Date : {item.inspection_date}<br/> Start Date :{item.start_date}<br/> End Date :{item.end_date}</p>
               
                </div>}
               
              </div>
            ))}
            
        </div>
      )}
{/*for displaying the griided areas */}
    {Array.from({ length: selectedAreaData.rows }).map((_, i) => (
      <div key={i} style={{ display: 'flex'}}>
        {Array.from({ length: selectedAreaData.columns }).map((_, j) => (
          <div
            key={j}
            style={{
              width: `${(selectedAreaData.pad_length)*20}px`,
              height: `${(selectedAreaData.pad_breadth)*20}px`,
              background:'#186F65' ,
               // Include padding and border in total width/height
              marginRight: j < selectedAreaData.columns - 1 ? `${(75 / 1000) * 20}px` : '0px', // Add right margin only for adjacent divs
              marginBottom: i < selectedAreaData.rows - 1 ? `${(75 / 1000) * 20}px` : '0px', // Add bottom margin only for adjacent divs
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

export default SupViewerarea;
