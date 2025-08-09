
// import React, { useState, useEffect } from 'react';
// import { Nav } from 'react-bootstrap';
// import { Link, useLocation } from 'react-router-dom';
// import { ChevronDown, ChevronRight, Menu } from 'lucide-react';
// import './sidebar.css';


// function SalesmanSidebar() {
//   const location = useLocation();
//     const [isCollapsed, setIsCollapsed] = useState(false);
//     const [openSection, setOpenSection] = useState('');

//   const isActive = (path) => location.pathname === path;

//   return (
//     <div className="d-flex flex-column p-3 bg-light" style={{ width: '220px', height: '100vh' }}>
//       <h4 className="text-center">Salesman</h4>
//       <Nav className="flex-column">
//         <Nav.Link as={Link} to="/salesman/dashboard" active={isActive('/salesman/dashboard')}>
//           Dashboard
//         </Nav.Link>
//         <Nav.Link as={Link} to="/salesman/customer" active={isActive('/salesman/customer')}>
//           Customer
//         </Nav.Link>
//         <Nav.Link as={Link} to="/salesman/sales" active={isActive('/salesman/sales')}>
//           Sales
//         </Nav.Link>
//         <Nav.Link as={Link} to="/salesman/sales/collectionreport" active={isActive('/salesman/sales/collectionreport')}>
//           Forcast Report
//         </Nav.Link>
//         {/* Add more links if needed */}
//       </Nav>
//     </div>
//   );
// }

// export default SalesmanSidebar;




import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Menu } from 'lucide-react';
import './sidebar.css';

function AdminSidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSection, setOpenSection] = useState('');


  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? '' : section);
  };

  const isActive = (path) => location.pathname === path;
  return (
    <div
      className={`bg-sidebar border-end d-flex flex-column ${isCollapsed ? 'p-2 min-sidebar-Collapsed' : 'p-3 min-sidebar-notCollapsed'}`}
      style={{
        width: isCollapsed ? '70px' : '250px',
        height: '100vh',
        transition: 'width 0.3s',
      }}
    >
      {/* Logo + Toggle */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        {!isCollapsed && <h5 className="mb-0">DSR Admin</h5>}
        <Menu role="button" size={24} onClick={toggleSidebar} />
      </div>

      <Nav className="flex-column gap-1">

        {/* Dashboard */}
        <Nav.Link
          className={`sidebar-subitem ${isActive('/salesman/dashboard') ? 'sidebar-subitem-active' : ''}`}
          as={Link}
          to="/salesman/dashboard"
        >
          {!isCollapsed && 'Dashboard'}
        </Nav.Link>
          <Nav.Link
          className={`sidebar-subitem ${isActive('/salesman/customer') ? 'sidebar-subitem-active' : ''}`}
          as={Link}
          to="/salesman/customer"
        >
          {!isCollapsed && 'Customer'}
        </Nav.Link>
        <Nav.Link
          className={`sidebar-subitem ${isActive('/salesman/sales') ? 'sidebar-subitem-active' : ''}`}
          as={Link}
          to="/salesman/sales"
        >
          {!isCollapsed && 'Sales'}
        </Nav.Link>
        <Nav.Link
          className={`sidebar-subitem ${isActive('/salesman/sales/collectionreport') ? 'sidebar-subitem-active' : ''}`}
          // className={`sidebar-subitem ${isActive('/salesman/sales/collectionreport') ? 'sidebar-subitem-active' : ''}`}
          as={Link}
          to="/salesman/sales/collectionreport"
        >
          {!isCollapsed && 'Collection Report'}
        </Nav.Link>
      </Nav>
    </div>
  );
}

export default AdminSidebar;
