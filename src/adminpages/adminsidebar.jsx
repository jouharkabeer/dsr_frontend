
import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Menu } from 'lucide-react';
import './sidebar.css';

function AdminSidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSection, setOpenSection] = useState('');

  useEffect(() => {
    if (
      location.pathname.startsWith('/admin/material') ||
      location.pathname.startsWith('/admin/materialcategory') ||
      location.pathname.startsWith('/admin/hardwarematerialcategory') ||
      location.pathname.startsWith('/admin/hardwarematerial') ||
      location.pathname.startsWith('/admin/timbermaterialcategory') ||
      location.pathname.startsWith('/admin/timbermaterial') ||
      location.pathname.startsWith('/admin/customer') ||
      location.pathname.startsWith('/admin/branch') ||
      location.pathname.startsWith('/admin/region') ||
      location.pathname.startsWith('/admin/prospect') ||
      location.pathname.startsWith('/admin/callstatus') ||
      location.pathname.startsWith('/admin/ordertype') ||
      location.pathname.startsWith('/admin/paymentmethod')
    ) {
      setOpenSection('master');
    } else if (
      location.pathname.startsWith('/admin/userpage') ||
      location.pathname.startsWith('/admin/usertype')
    ) {
      setOpenSection('user');
    } else if (location.pathname.startsWith('/admin/sales')) {
      setOpenSection('sales');
    } else {
      setOpenSection('');
    }
  }, [location.pathname]);

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
          className={`sidebar-item ${isActive('/admin/dashboard') ? 'sidebar-main-active' : ''}`}
          as={Link}
          to="/admin/dashboard"
        >
          {!isCollapsed && 'Dashboard'}
        </Nav.Link>

        {/* Master Data */}
        <div>
          <Nav.Link
            className={`sidebar-item ${openSection === 'master' ? 'sidebar-main-active' : ''}`}
            onClick={() => toggleSection('master')}
          >
            {!isCollapsed && (
              <>
                Master Data{' '}
                {openSection === 'master' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </>
            )}
          </Nav.Link>
          {openSection === 'master' && !isCollapsed && (
            <div className="ms-3">
              <Nav.Link
                as={Link}
                to="/admin/hardwarematerialcategory"
                className={`sidebar-subitem ${isActive('/admin/hardwarematerialcategory') ? 'sidebar-subitem-active' : 'sidebar-subitem-activedf'}`}
              >
               Hardware Category
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/admin/hardwarematerial"
                className={`sidebar-subitem ${isActive('/admin/hardwarematerial') ? 'sidebar-subitem-active' : ''}`}
              >
               Hardware Material
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/admin/timbermaterialcategory"
                className={`sidebar-subitem ${isActive('/admin/timbermaterialcategory') ? 'sidebar-subitem-active' : 'sidebar-subitem-activedf'}`}
              >
               Timber Category
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/admin/timbermaterial"
                className={`sidebar-subitem ${isActive('/admin/timbermaterial') ? 'sidebar-subitem-active' : ''}`}
              >
               Timber Material
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/admin/customer"
                className={`sidebar-subitem ${isActive('/admin/customer') ? 'sidebar-subitem-active' : ''}`}
              >
                Customer
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/admin/branch"
                className={`sidebar-subitem ${isActive('/admin/branch') ? 'sidebar-subitem-active' : ''}`}
              >
                Branch
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/admin/region"
                className={`sidebar-subitem ${isActive('/admin/region') ? 'sidebar-subitem-active' : ''}`}
              >
                Region
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/admin/prospect"
                className={`sidebar-subitem ${isActive('/admin/prospect') ? 'sidebar-subitem-active' : ''}`}
              >
                Prospect
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/admin/callstatus"
                className={`sidebar-subitem ${isActive('/admin/callstatus') ? 'sidebar-subitem-active' : ''}`}
              >
                Call Status
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/admin/ordertype"
                className={`sidebar-subitem ${isActive('/admin/ordertype') ? 'sidebar-subitem-active' : ''}`}
              >
                Order Types
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/admin/paymentmethod"
                className={`sidebar-subitem ${isActive('/admin/paymentmethod') ? 'sidebar-subitem-active' : ''}`}
              >
                Payment Methods
              </Nav.Link>
            </div>
          )}
        </div>

        {/* Users */}
        <div>
          <Nav.Link
            className={`sidebar-item ${openSection === 'user' ? 'sidebar-main-active' : ''}`}
            onClick={() => toggleSection('user')}
          >
            {!isCollapsed && (
              <>
                Users{' '}
                {openSection === 'user' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </>
            )}
          </Nav.Link>
          {openSection === 'user' && !isCollapsed && (
            <div className="ms-3">
              <Nav.Link
                as={Link}
                to="/admin/userpage"
                className={`sidebar-subitem ${isActive('/admin/userpage') ? 'sidebar-subitem-active' : ''}`}
              >
                User
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/admin/usertype"
                className={`sidebar-subitem ${isActive('/admin/usertype') ? 'sidebar-subitem-active' : ''}`}
              >
                User Type
              </Nav.Link>
            </div>
          )}
        </div>

        {/* Sales */}
        <div>
          <Nav.Link
            className={`sidebar-item ${openSection === 'sales' ? 'sidebar-main-active' : ''}`}
            onClick={() => toggleSection('sales')}
          >
            {!isCollapsed && (
              <>
                Sales{' '}
                {openSection === 'sales' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </>
            )}
          </Nav.Link>
          {openSection === 'sales' && !isCollapsed && (
             <Nav.Link
                as={Link}
                to="/sales/salespage"
                className={`sidebar-subitem ${isActive('/sales/salespage') ? 'sidebar-subitem-active' : ''}`}
              >
                Sales
              </Nav.Link>
              
          )}
        </div>
      </Nav>
    </div>
  );
}

export default AdminSidebar;
