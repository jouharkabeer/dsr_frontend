// src/adminpages/adminsidebar.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

function AdminSidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="d-flex flex-column p-3 bg-light" style={{ width: '220px', height: '100vh' }}>
      <h4 className="text-center">Admin</h4>
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/admin/dashboard" active={isActive('/admin/dashboard')}>
          Dashboard
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/material" active={isActive('/admin/material')}>
          Material
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/customer" active={isActive('/admin/customer')}>
          Customer
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/userpage" active={isActive('/admin/userpage')}>
          User
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/usertype" active={isActive('/admin/usertype')}>
          User Type
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/branch" active={isActive('/admin/branch')}>
          Branch
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/region" active={isActive('/admin/region')}>
          Region
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/prospect" active={isActive('/admin/prospect')}>
          Prospect
        </Nav.Link>
        {/* Add more options here */}
      </Nav>
    </div>
  );
}

export default AdminSidebar;



// // src/adminpages/adminsidebar.jsx
// import React, { useState } from "react";
// import {
//   AccountCircle,
//   ArrowDropDown,
//   ArrowDropUp,
//   Inventory,
//   Dashboard,
// } from "@mui/icons-material";
// import { NavLink, useLocation } from "react-router-dom";
// import "./clientsidebar.css"; // adjust path as needed
// import { useSidebar } from "../context/SidebarContext";
// import MenuIcon from "@mui/icons-material/Menu";

// const AdminSidebar = () => {
//   const { sidebarOpen, toggleSidebar } = useSidebar();
//   const [activeMenu, setActiveMenu] = useState(null);
//   const location = useLocation();

//   const toggleMenu = (menu) => {
//     setActiveMenu((prevMenu) => (prevMenu === menu ? null : menu));
//   };

//   return (
   
//     <div onClick={toggleSidebar} className="client_sidebar" style={{
//         width: sidebarOpen ? "250px" : "80px",
        
//         transition: "width 0.3s ease",
//         position: "fixed",
//         top: 0,
//         left: 0,
//         height: "100vh",
//         zIndex: 1000,}}>
//       <div className="client_sidebar_Container">
//         <div className="menuItems">
//           {/* Dashboard */}
//           <NavLink
//             to="/dashboard"
//             className="link"
//             style={location.pathname === "/dashboard" ? { color: "blue" } : null}
//           >
//             <div className="Item">
//               <div className="itemsecond">
//                 <Dashboard className="itemIcon" />
//                 <span className="itemname" style={{display : sidebarOpen ? "flex" : "none",}}>Dashboard</span>
//               </div>
//             </div>
//           </NavLink>

//           {/* Master Section */}
//           <div className="Item" onClick={() => toggleMenu("Master")}>
//             <div className="itemsecond">
//               <AccountCircle className="itemIcon" />
//               <span className="itemname" style={{display : sidebarOpen ? "flex" : "none",}}>Master</span>
//             </div>
//             {activeMenu === "Master" ? <ArrowDropUp /> : <ArrowDropDown />}
//           </div>

//           {activeMenu === "Master" && (
//             <div className="submenuItems" style={{display : sidebarOpen ? "flex" : "none",}}>
//               <NavLink to="/material" className="link">
//                 <div
//                   className="submenu"
//                   style={
//                     location.pathname === "/material"
//                       ? { color: "black", fontWeight: "bold" }
//                       : null
//                   }
//                 >
//                   <Inventory className="me-2" /> Material
//                 </div>
//               </NavLink>

//               {/* You can add more menu items like Customers, Users etc. here */}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminSidebar;
