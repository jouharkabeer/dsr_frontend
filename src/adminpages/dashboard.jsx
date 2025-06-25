// src/adminpages/dashboard.jsx
import React from 'react';
import AdminSidebar from './adminsidebar';
import { Container } from 'react-bootstrap';
import TopNavbar from '../components/TopNavbar';
import axios from 'axios';
import { Api } from '../api';
function AdminDashboard() {

    const cleandata = async () => {
    try {
      const res = await axios.post(`${Api}/user/cleaner/dev/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      console.log(res)
    } catch (err) {
      console.error('Failed to fetch Customers:', err);
    }
  };
  return (
      <div className="d-flex flex-column" style={{ height: '100vh' }}>
        <TopNavbar />
    <div className="d-flex">
      <AdminSidebar />
      <Container className="p-4">
        <h2>Welcome, Super Admin</h2>
        <p>This is your dashboard.</p>
        <button onClick={cleandata}>clean data</button>
      </Container>
    </div>
    </div>
  );
}

export default AdminDashboard;
