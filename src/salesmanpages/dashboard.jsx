// src/salesmanpages/dashboard.jsx
import React from 'react';
import { Container } from 'react-bootstrap';
import SalesmanSidebar from './salesmansidebar';
import TopNavbar from '../components/TopNavbar';

function SalesmanDashboard() {
  return (
    <div className="d-flex flex-column" style={{ height: '100vh' }}>
      <TopNavbar />
    <div className="d-flex">
      <SalesmanSidebar />
      <Container className="p-4">
        <h2>Welcome, Salesman</h2>
        <p>This is your dashboard.</p>
      </Container>
    </div>
  </div>
  );
}

export default SalesmanDashboard;
