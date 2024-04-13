import React ,{useState} from 'react';
import logo from '../../../Saint-Gobain_SEFPRO_logo_2023.png';
import './Planning.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminPlanning() {
  const [isAlert,setIsAlertOpen]=useState(false);
  const [customerName,setCustomerName]= useState('');
  const [oaNumber,setOaNumber]= useState('');
  const [drawingNumber,setDrawingNumber]= useState('');
  const [modelName,setModelName]= useState('');
  const [length,setLength]= useState('');
  const [breadth,setBreadth]= useState('');
  const [height,setHeight]= useState('');
  const [inspection, setInspection] = useState(new Date().toISOString().split('T')[0]);

  

  const handleisAlert = () => {
    if (isAlert) {
      return;
    }

    axios
    .post('http://localhost:5000/api/product', { customerName, oaNumber,drawingNumber,modelName, length, breadth,height,inspection})
    .then((response) => {
      console.log('Server response:',response.data); // If needed, you can display a success message to the user
      setIsAlertOpen(true);
       // Show the success alert
    })
    .catch(error => {
      console.error('Axios error:', error);
    
      // Log the entire error object and its properties
      console.log('Error response data:', error.response?.data);
    
      // Display specific error and details
      const errorMessage = error.response?.data?.error || 'Unknown error';
      const errorDetails = error.response?.data?.details || 'No details available';
    
      alert(`${errorMessage}\nDetails: ${errorDetails}`);
    });
    

    
    
  };
  

  const handleCloseAlert = () => {
    setIsAlertOpen(false);
  };
  const handleSubmit = () => {
    // Handle form submission here
   
    handleCloseAlert();
    setCustomerName('');
    setBreadth('');
    setDrawingNumber('');
    setHeight('');
    setLength('');
    setOaNumber('');
    setModelName('');
    setInspection('');
    
  };

  const navigate = useNavigate();

  const navigateToFileupload = () => {
    //  navigate 
    navigate('/AdminFileUpload');
  };

  const navigateToPlanning = () => {
    navigate('/AdminPlanning');
  }

  const navigateToSlicing =() => {
    navigate('/AdminSlicing');
  }

  const navigateToBook = () => {
    navigate('/AdminBook')
  }
  const navigateToDashboard=() =>{
    navigate('/AdminDashboard')
  }

  const navigateToArea=() =>{
    navigate('/AdminViewerArea')
  }
const navigateToLogin=() => {
  navigate('/')
}

  const [showNav, setShowNav] = useState(false);
  
  const handleMouseEnter = () => {
    setShowNav(true);
  };
  
  const handleMouseLeave = () => {
    setShowNav(false);
  };
  

  const navigateToUsers =() => {
    navigate('/AdminUserDashboard')
  }

  const navigateToCustomers =() => {
    navigate('/AdminCustomerDashboard')
  }

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
          <p className='headerText' onClick={navigateToUsers}>Users</p>
        </div>
        <div className="pages" onClick={navigateToCustomers}>
          <p className='headerText'>Customers</p>
        </div>
       
        <div className="logout" style={{ marginLeft: '15%' }} onClick={() => setShowDialog(true)}>
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
      
      <div className='Plan' style={{marginTop:'3%'}}>
        <h1 style={{ textAlign: 'center' }}>PLANNING</h1>
        <h3 style={{ textAlign: 'center' }}>Enter the details of each drawing. </h3>
       
      </div>

      

      <div  className="det">
      
     
        <div  className="detLeft"style={{width:'40%'}}> 
        <label>Customer Name</label> <br/>
        <input type="text" id="customer_name" value={customerName} onChange={e=>setCustomerName(e.target.value)}/><br/><br/>
        <label> Assembly Drawing Number</label><br/>
        <input type="text"  id="drawing_number" value={drawingNumber} onChange={e=>setDrawingNumber(e.target.value)}/><br/><br/>
        <label>Order Number</label><br/>
        <input type="text"  id="oa_number" value={oaNumber} onChange={e=>setOaNumber(e.target.value)}/><br/><br/>
        
        <label>Module  Name</label><br/>
        <input type="text"  id="module_name" value={modelName} onChange={e=>setModelName(e.target.value)}/><br/><br/>
        </div>
        <div className="detRight"style={{width:'40%'}}>
        <label>Length</label><br/>
        <input type="text"  id="length" value={length} onChange={e=>setLength(e.target.value)}/><br/><br/>
        <label>Breadth</label><br/>
        <input type="text" id="breadth" value={breadth} onChange={e=>setBreadth(e.target.value)}/><br/><br/>
       <label>Height</label><br/>
        <input type="text"  id="height" value={height} onChange={e=>setHeight(e.target.value)}/><br/><br/>
       
      
       

        <label>Inspection Date</label><br/>
<input type="date" value={inspection} onChange={(e) => setInspection(e.target.value)} /><br/><br/>

        
      
    </div>
    </div>
      <div className ="footer"style={{display:'flex',marginTop:'10vh',textAlign:'centre',justifyContent: 'flex-end'}}>
     
      <div style={{width:'33%', display: 'flex', justifyContent: 'flex-end'}}>
        <button style={{marginLeft:'12%'}} onClick={handleisAlert}>Submit</button>
      </div>
      </div>
      {isAlert && (
           <div className="custom-modal">
           <div className="modal-content"    >
            <div >

           <h3 > Data Uploaded Successfully!</h3>
           <button onClick={handleSubmit}>OK</button> 
           </div>
            </div>
            </div>
      )}
      
      </div>
            
               
  );
}

export default AdminPlanning;


