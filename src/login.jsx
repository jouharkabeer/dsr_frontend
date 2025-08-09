// src/login.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Card, InputGroup } from 'react-bootstrap';
import { Api } from './api';
import logo from './assets/logo.png'
import Loader from './components/Loader';
import { BiShow, BiHide } from "react-icons/bi";

function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

const Tokenvaliditychecker = async () => {
  try {
    setLoading(true);
    const res = await axios.get(`${Api}/user/validity/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    const data = res.data; // ✅ Fix: use res.data instead of res.message
    console.log(data)
    if (data.message === 'its a valid token') { // ✅ Fix: comparison operator `===`, and correct string
      const userrtype = localStorage.getItem('user_type');
      if (userrtype === 'SuperAdmin') {
        navigate('/admin/dashboard');
      } else if (userrtype === 'Salesman') {
        navigate('/salesman/dashboard');
      } else {
        alert('Unknown user type!');
      }
    }

    setLoading(false); // ✅ Move out of if-else to ensure it always runs
  } catch (err) {
    // console.error('Token check failed:', err);
    setLoading(false); // ✅ Also handle loading off in case of error
  }
};

  useEffect(() => {
    Tokenvaliditychecker();
  }, []);


  const handleLogin = async (e) => {
    setLogin(true)
    e.preventDefault();
    try {
      const res = await axios.post(`${Api}/user/login/`, {
        username,
        password,
      });

      const { access, refresh, usertype, user_id, login_name } = res.data;
      setLogin(false)
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_type', usertype);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('login_name', login_name);
console.log(access)
      if (usertype === 'SuperAdmin') {
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
      {loading ? <Loader/> :
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
              {/* <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              /> */}
                        <InputGroup>
            <Form.Control
            placeholder='Password'
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <BiHide /> : <BiShow />}
            </Button>
          </InputGroup>
            </Form.Group>


            <Button type="submit" variant="primary" className="w-100">
              {login ? "Please Wait..." : "Sign In"}
            </Button>
          </Form>
        </Card.Body>
      </Card>}
    </Container> 
  );
}

export default Login;
