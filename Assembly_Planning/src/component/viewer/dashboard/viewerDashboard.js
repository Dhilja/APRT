import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../../../Saint-Gobain_SEFPRO_logo_2023.png';
import { useNavigate } from 'react-router-dom';
import './dashboard.css'


/* for the displaying the table*/ 
function TableData() {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
 
/* for fetching the assembly area data*/
  useEffect(() => {
   

    axios
      .get('http://localhost:5000/api/data')
      .then(response => {
        setData(response.data);
        console.log('Response from server:', response.data);
      })
      .catch(error => {
        console.log(error);
      });

      
  }, []);

  

  

/*for filtering based on the string in the search*/
  const filteredData = data.filter(item => {
    const searchString = searchText.trim().toLowerCase();
    return (
      item.area_number.toLowerCase().includes(searchString) ||
      item.plant_number.toString().includes(searchString));/* ||
    item.total_area.toString().includes(searchString) ||
      item.available_area.toString().includes(searchString) ||
      item.occupied_area.toString().includes(searchString)
    )*/
  });

 

  return (
    <div>
    <div className="searchTab" >
        <input type="text" placeholder={'search assembly area...' } className="search" value={searchText} onChange={e=> setSearchText(e.target.value)} />
       </div>
    <table style={{marginTop:"3%"}}>
      <thead>
        <tr>
          <th>Assembly Area number</th>
          <th>Plant number</th>
          <th>Total Area</th>
          <th>Available Area</th>
          <th>Occupied Area</th>
          <th>Percentage of Use</th>
         
        </tr>
      </thead>
      <tbody>
        
        {filteredData.map(item => (
          <tr key={item.area_number}>
            <td>{item.area_number}</td>
            <td>{item.plant_number}</td>
            <td>{item.total_area}</td>
            <td>{item.available_area}</td>
            <td>{item.occupied_area}</td>
            <td>
              <div className="progress1">
                <div className="progress-bar1" style={{width :`${(item.occupied_area/item.total_area)*100}%`}}>
                <div className="progress-overlay1">
              <div className="progress-text1">{`${Math.round((item.occupied_area / item.total_area) * 100)}%`}</div>
            </div>
             </div>
                
              </div>
            </td>
            
          </tr>
        ))}
      </tbody>
    </table>
   

      

    </div>
  );
}


/* for the full page*/
function ViewerDashBoard() {

 

  const navigate = useNavigate();

 

  const navigateToviewerDashboard=() =>{
    navigate('/ViewerDashboard')
  }

  const navigateToviewerArea=() =>{
    navigate('/ViewerArea')
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
          <p className='home' style={{ color: 'hsl(180.3deg 100% 39.02%)' }} onClick={navigateToviewerDashboard}>Home</p>
        </div>
        <div className="pages">
          <p className='headerText' onClick={navigateToviewerArea}>view </p>
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
      
       
    

     
     
      {/* calling the function tbale dat to display the table*/}
      <div className="assemblyPadTable" style={{marginTop:'2%'}}>
  <div className="table-container">
 
    <TableData />
  </div>
</div>

    </div>
  );
}

export default ViewerDashBoard;
