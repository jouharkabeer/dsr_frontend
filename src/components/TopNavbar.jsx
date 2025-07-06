// src/components/TopNavbar.jsx
import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'

function TopNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" className="px-4">
      <Container fluid>
        <Navbar.Brand><img src={logo} alt='logo' width='100px'/></Navbar.Brand>
        <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;
