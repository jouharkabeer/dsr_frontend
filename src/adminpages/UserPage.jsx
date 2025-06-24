import React, { useEffect, useState } from 'react';
import {
  Button, Table, Modal, Form, ToggleButtonGroup, ToggleButton, Row, Col, InputGroup
} from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from './adminsidebar';
import TopNavbar from '../components/TopNavbar';
import { Api } from '../api';

function UserPage() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
    const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    confirm_password: '',
    user_type: '',
    });
    const [userTypes, setUserTypes] = useState([]);

  const [showPassword, setShowPassword] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${Api}/user/view_allUsers/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchUserTypes = async () => {
  try {
    const res = await axios.get(`${Api}/user/view_activeUserType/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    setUserTypes(res.data);
    console.log (userTypes)
  } catch (err) {
    console.error('Failed to fetch user types:', err);
  }
};

  useEffect(() => {
    fetchUsers();
    fetchUserTypes();
  }, []);

  const filteredUsers = users.filter((user) => {
    if (filter === 'active') return user.is_active;
    if (filter === 'inactive') return !user.is_active;
    return true;
  });

  const handleShowModal = (user = null) => {
    setEditUser(user);
    setForm(user ? {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      username: user.username,
      password: '',
      confirm_password: '',
      user_type: user.user_type,
    } : {
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      password: '',
      confirm_password: '',
      user_type: '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editUser && form.password !== form.confirm_password) {
      alert("Passwords do not match.");
      return;
    }

    const url = editUser
      ? `${Api}/user/update_User/${editUser.id}/`
      : `${Api}/user/create_User/`;
    const method = editUser ? 'put' : 'post';

    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      username: form.username,
      user_type: form.user_type,
    };

    if (!editUser) payload.password = form.password;

    try {
      await axios({
        method,
        url,
        data: payload,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error('Failed to save user:', err);
    }
  };

  const toggleUserStatus = async (id, action) => {
    try {
      await axios.delete(`${Api}/user/${action}_User/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchUsers();
    } catch (err) {
      console.error(`Failed to ${action} user:`, err);
    }
  };

  return (
    <div className="d-flex flex-column" style={{ height: '100vh' }}>
      <TopNavbar />
      <div className="d-flex flex-grow-1">
        <AdminSidebar />
        <div className="p-4 flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
          <Row className="mb-3 align-items-center">
            <Col><h3>Users</h3></Col>
            <Col className="text-end">
              <Button onClick={() => handleShowModal()} variant="primary">+ Add User</Button>
            </Col>
          </Row>

          <ToggleButtonGroup type="radio" name="filter" value={filter} onChange={setFilter} className="mb-3">
            <ToggleButton id="all" value="all" variant="outline-secondary">All</ToggleButton>
            <ToggleButton id="active" value="active" variant="outline-success">Active</ToggleButton>
            <ToggleButton id="inactive" value="inactive" variant="outline-danger">Inactive</ToggleButton>
          </ToggleButtonGroup>

          <Table bordered hover responsive className="bg-white shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>User Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.full_name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.user_type_name}</td>
                  <td>{user.is_active ? 'Active' : 'Inactive'}</td>
                  <td>
                    <Button size="sm" variant="warning" onClick={() => handleShowModal(user)} className="me-2">Edit</Button>
                    <Button
                      size="sm"
                      variant={user.is_active ? 'danger' : 'success'}
                      onClick={() => toggleUserStatus(user.id, user.is_active ? 'disable' : 'enable')}
                    >
                      {user.is_active ? 'Disable' : 'Enable'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Add/Edit Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>{editUser ? 'Edit' : 'Add'} User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-2">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                  />
                </Form.Group>
                {!editUser && (
                  <>
                    <Form.Group className="mb-2">
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                          required
                        />
                        <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? 'Hide' : 'Show'}
                        </Button>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        value={form.confirm_password}
                        onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </>
                )}
                <Form.Group className="mb-2">
  <Form.Label>User Type</Form.Label>
  <Form.Select
    value={form.user_type}
    onChange={(e) => setForm({ ...form, user_type: e.target.value })}
    required
  >
    <option value="">Select User Type</option>
    {userTypes.map((type) => (
      <option key={type.id} value={type.id}>{type.name}</option>
    ))}
  </Form.Select>
</Form.Group>

                {/* <Form.Group className="mb-2">
                  <Form.Label>User Type (ID)</Form.Label>
                  <Form.Control
                    type="number"
                    value={form.user_type}
                    onChange={(e) => setForm({ ...form, user_type: e.target.value })}
                    required
                  />
                </Form.Group> */}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSave}>
                {editUser ? 'Update' : 'Create'}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default UserPage;
