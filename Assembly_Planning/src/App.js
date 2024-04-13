import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './login';
import AdminDashboard from './component/admin/dashboard/dashBoard';
import AdminBook from './component/admin/book/bookPage';
import AdminColorTiles from './component/admin/Customer/ColorTiles';
import AdminCustomerDashBoard from './component/admin/Customer/customers';
import AdminFileUpload from './component/admin/fileupload/fileUpload';
import AdminPlanning from './component/admin/planning/Planning';
import AdminSlicing from './component/admin/slicing/slicing';
import AdminTiles from './component/admin/Customer/tile';
import AdminViewerarea from './component/admin/Area/viewerArea';
import AdminUserDashBoard from './component/admin/Users/Users';
import SupBook from './component/supervisor/book/bookPage';
import SupColorTiles from './component/supervisor/Customer/ColorTiles';
import SupCustomerDashBoard from './component/supervisor/Customer/customers';
import SupDashBoard from './component/supervisor/dashboard/dashBoard';
import SupSlicing from './component/supervisor/slicing/slicing';
import SupTiles from './component/supervisor/Customer/tile';
import SupUsers from './component/supervisor/Users/Users';
import SupPlanning from './component/supervisor/planning/Planning';
import SupViewerarea from './component/supervisor/Area/viewerArea';
import SupFileUpload from './component/supervisor/fileupload/fileUpload';
import ViewerDashBoard from './component/viewer/dashboard/viewerDashboard';
import Viewerarea from './component/viewer/area/viewerArea';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Default route */}
        <Route path="/AdminDashboard" element = {<AdminDashboard/>}/>
        <Route path="/AdminPlanning" element ={<AdminPlanning/>}/>
        <Route path="/AdminSlicing" element = {<AdminSlicing/>}/>
        <Route path ="/AdminFileUpload" element ={<AdminFileUpload/>}/>
        <Route path ="/AdminBook" element = {<AdminBook/>}/>
        <Route path = "/AdminViewerArea" element = {<AdminViewerarea/>}/>
        <Route path ="/AdminUserDashboard" element = {<AdminUserDashBoard/>}/>
        <Route path ="/AdminCustomerDashboard"  element = {<AdminCustomerDashBoard/>}/>
        <Route path ="/AdminColorTiles" element = {<AdminColorTiles/>}/>
        <Route path ="/Admintile/:OAN" element = {<AdminTiles/>}/>
        
        
        <Route path="/SupDashboard" element = {<SupDashBoard/>}/>
        <Route path="/SupPlanning" element ={<SupPlanning/>}/>
        <Route path="/SupSlicing" element = {<SupSlicing/>}/>
        <Route path ="/SupFileUpload" element ={<SupFileUpload/>}/>
        <Route path ="/SupBook" element = {<SupBook/>}/>
        <Route path = "/SupViewerArea" element = {<SupViewerarea/>}/>
        <Route path ="/SupUserDashboard" element = {<SupUsers/>}/>
        <Route path ="/SupCustomerDashboard"  element = {<SupCustomerDashBoard/>}/>
        <Route path ="/SupColorTiles" element = {<SupColorTiles/>}/>
        <Route path ="/Suptile/:OAN" element = {<SupTiles/>}/>

        
        <Route path="/ViewerDashboard" element = {<ViewerDashBoard/>}/>
        <Route path = "/ViewerArea" element = {<Viewerarea/>}/>




        
        
      </Routes>
    </Router>
  );
}

export default App;
