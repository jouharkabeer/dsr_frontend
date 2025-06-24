// src/adminpages/dashboard.jsx
import React from 'react';
import AdminSidebar from './adminsidebar';
import { Container } from 'react-bootstrap';

function AdminDashboard() {
  return (
    <div className="d-flex">
      <AdminSidebar />
      <Container className="p-4">
        <h2>Welcome, Super Admin</h2>
        <p>This is your dashboard.</p>
      </Container>
    </div>
  );
}

export default AdminDashboard;
