// src/login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { Api } from './api';
import logo from './assets/logo.png'

function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleApiChange = (newApi) => {
    setApi(newApi);
    console.log('Current API:', getApi());
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${Api}/user/login/`, {
        username,
        password,
      });
      console.log(res.data)
      const { access, refresh, usertype, user_id, login_name } = res.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_type', usertype);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('login_name', login_name);

      if (usertype === 'Super Admin') {
        navigate('/admin/dashboard');
      } else if (usertype === 'Salesman') {
        navigate('/salesman/dashboard');
      } else {
        alert('Unknown user type!');
      }
    } catch (error) {
      alert('Invalid login credentials');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }} className="p-4 shadow">
        <Card.Body>
          <div className="text-center mb-4">
            <img src={logo} alt="Company Logo" width="120" />
          </div>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="username" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="password" className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              Sign In
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;
