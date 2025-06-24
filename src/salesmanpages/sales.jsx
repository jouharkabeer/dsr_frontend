// src/salesmanpages/sales.jsx
import React from 'react';
import SalesmanSidebar from './salesmansidebar';
import { Container } from 'react-bootstrap';

function SalesPage() {
  return (
    <div className="d-flex">
      <SalesmanSidebar />
      <Container className="p-4">
        <h3>Sales Page</h3>
        <p>This will display sales-related information for salesmen.</p>
      </Container>
    </div>
  );
}

export default SalesPage;
