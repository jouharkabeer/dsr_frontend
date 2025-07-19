// src/salesmanpages/salesmansidebar.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

function SalesmanSidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="d-flex flex-column p-3 bg-light" style={{ width: '220px', height: '100vh' }}>
      <h4 className="text-center">Salesman</h4>
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/salesman/dashboard" active={isActive('/salesman/dashboard')}>
          Dashboard
        </Nav.Link>
        <Nav.Link as={Link} to="/salesman/customer" active={isActive('/salesman/customer')}>
          Customer
        </Nav.Link>
        <Nav.Link as={Link} to="/salesman/sales" active={isActive('/salesman/sales')}>
          Sales
        </Nav.Link>
        {/* Add more links if needed */}
      </Nav>
    </div>
  );
}

export default SalesmanSidebar;
