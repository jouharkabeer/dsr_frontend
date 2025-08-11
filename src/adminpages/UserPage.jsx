import React, { useEffect, useState } from 'react';
import {
  Button, Modal, Form, Row, Col, Alert, InputGroup, ToggleButtonGroup, ToggleButton,
} from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from './adminsidebar';
import TopNavbar from '../components/TopNavbar';
import { Api } from '../api';
import { DataGrid } from '@mui/x-data-grid';
import { BiShow, BiHide } from "react-icons/bi";
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import Loader from '../components/Loader';
import { showToast } from '../components/ToastNotify';


function UserPage() {
  const [users, setUsers] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [branches, setBranches] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    confirm_password: '',
    user_type: '',
    branch: '',
  });

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${Api}/user/view_allUsers/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setUsers(res.data);
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchUserTypes = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${Api}/user/view_activeUserType/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      const res2 = await axios.get(`${Api}/master/view_activeBranch/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setBranches(res2.data);
      console.log(res2.data)
      setUserTypes(res.data);
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch datas:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchUserTypes();
  }, []);

  const filteredUsers = users.filter(user => {
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
      branch: user.branch
    } : {
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      password: '',
      confirm_password: '',
      user_type: '',
      branch: '',
    });
    setError('');
    setShowModal(true);
  };
console.log(form)

  const handleSave = async () => {

     if (!editUser) {
    // Check password match
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    // Password strength regex
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setError(
        'Password must be at least 8 characters long, contain 1 uppercase letter, 1 number, and 1 special character.'
      );
      return;
    }
  }
    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      username: form.username,
      user_type: form.user_type,
      branch: form.branch,
    };

    if (!editUser) {
      payload.password = form.password;
    }

    const url = editUser
      ? `${Api}/user/update_User/${editUser.id}/`
      : `${Api}/user/create_User/`;
    const method = editUser ? 'put' : 'post';

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
      showToast.success(`Sucessfully ${editUser ? 'Edited' : 'Created'} ${form.first_name}`)
    } catch (err) {
      showToast.error(`Failed to ${editUser ? 'Edit' : 'Create'}  ${form.first_name}`)
      // setError(err.response.data.username || err.response.data.email || "an error occured")
      const errors = [];
if (err.response?.data?.username) errors.push(err.response.data.username);
if (err.response?.data?.email) errors.push(err.response.data.email);

setError(errors.join(' | ') || "An error occurred");
      console.error('Failed to save user:', err.response.data.username);
    }
  };
const userid = localStorage.getItem('user_id')


  const toggleStatus = async (id, action) => {
    if (id == userid){
      alert("you dont have the permission to disable you")
    }
    else {
    try {
      await axios.delete(`${Api}/user/${action}_User/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchUsers();
      showToast.success(`Sucessfully ${action}d ${form.first_name}`)
    } catch (err) {
      showToast.error(`Failed to ${action}  ${form.first_name}`)
      console.error(`Failed to ${action} user:`, err);
    }
  }
  };

  const columns = [
{
  field: 'namefull',
  headerName: 'Full Name',
  width : 150, 

},

    { field: 'username', headerName: 'Username', width : 150,  },
    { field: 'email', headerName: 'Email', width : 150,  },
    { field: 'user_type_name', headerName: 'User Type', width : 150,  },
    { field: 'branch_code', headerName: 'Branch', width : 150,  },
    {
      field: 'is_active',
      headerName: 'Status',
      width : 150, 
      renderCell: (params) => (params.value ? 'Active' : 'Inactive'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width : 150, 
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton color="warning" onClick={() => handleShowModal(params.row)}><EditIcon /></IconButton>
          <IconButton
            color={params.row.is_active ? 'error' : 'success'}
            onClick={() => toggleStatus(params.row.id, params.row.is_active ? 'disable' : 'enable')}
          >
            {params.row.is_active ? <ToggleOffIcon /> : <ToggleOnIcon />}
          </IconButton>
        </>
      )
    }
  ];

  return (
    <div className="d-flex flex-column" style={{ height: '100vh' }}>
      <TopNavbar />
      <div className="d-flex flex-grow-1">
        <AdminSidebar />
        {loading ? <Loader/> :
        <div className="p-4 flex-grow-1 overflow-auto" style={{ maxHeight: '100%', backgroundColor: '#f8f9fa' }}>
          <Row className="mb-3 align-items-center">
            <Col><h3>Users</h3></Col>
            <Col className="text-end">
              <Button onClick={() => handleShowModal()} variant="primary">+ Add</Button>
            </Col>
          </Row>

          <ToggleButtonGroup type="radio" name="filter" value={filter} onChange={setFilter} className="mb-3">
            <ToggleButton id="all" value="all" variant="outline-secondary">All</ToggleButton>
            <ToggleButton id="active" value="active" variant="outline-success">Active</ToggleButton>
            <ToggleButton id="inactive" value="inactive" variant="outline-danger">Inactive</ToggleButton>
          </ToggleButtonGroup>

          <div style={{ height: 600, width: '100%' }} className="bg-white p-3 rounded shadow-sm">
            <DataGrid
              rows={filteredUsers}
              columns={columns}
              getRowId={(row) => row.id}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 25]}
              checkboxSelection
              disableRowSelectionOnClick
              disableColumnMenu
              disableDensitySelector
              showToolbar
              slotProps={{
                toolbar: {
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
            />
          </div>

          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>{editUser ? 'Edit' : 'Add'} User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form>

  {/* Row 1: First Name + Last Name */}
  <Row className="mb-2">
    <Col md={6}>
      <Form.Group>
        <Form.Control
          type="text"
          placeholder='First Name'
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          required
        />
      </Form.Group>
    </Col>
    <Col md={6}>
      <Form.Group>
        <Form.Control
          type="text"
          placeholder='Last Name'
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
        />
      </Form.Group>
    </Col>
  </Row>

  {/* Row 2: Email + Username */}
  <Row className="mb-2">
    <Col md={6}>
      <Form.Group>
        <Form.Control
          type="email"
          placeholder='Email'
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </Form.Group>
    </Col>
    <Col md={6}>
      <Form.Group>
        <Form.Control
          type="text"
          placeholder='Username'
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
      </Form.Group>
    </Col>
  </Row>

  {/* Row 3: Password + Confirm Password (only if !editUser) */}
  {!editUser && (
    <Row className="mb-2">
      <Col md={6}>
        <Form.Group>
          <InputGroup>
            <Form.Control
            placeholder='Password'
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <BiHide /> : <BiShow />}
            </Button>
          </InputGroup>
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group>
          <Form.Control
            placeholder='Confirm Password'
            type={showPassword ? 'text' : 'password'}
            value={form.confirm_password}
            onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
            required
          />
        </Form.Group>
      </Col>
    </Row>
  )}

  {/* Row 4: User Type + Branch */}
  <Row className="mb-2">
    <Col md={6}>
      <Form.Group>
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
    </Col>

    <Col md={6}>
      <Form.Group>
        <Form.Select
          value={form.branch}
          onChange={(e) => setForm({ ...form, branch: e.target.value })}
          required
        >
          <option value="">Select Branch</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>{branch.branch_code}</option>
          ))}
        </Form.Select>
      </Form.Group>
    </Col>
  </Row>

</Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSave}>
                {editUser ? 'Update' : 'Create'}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>}
      </div>
    </div>
  );
}

export default UserPage;

