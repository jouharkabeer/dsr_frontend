import React, { useEffect, useState } from 'react';
import {
  Button, Table, Modal, Form, ToggleButtonGroup, ToggleButton, Row, Col,
} from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from './adminsidebar';
import TopNavbar from '../components/TopNavbar';
import { Api } from '../api';
function UserTypePage() {
  const [userTypes, setUserTypes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editUserType, setEditUserType] = useState(null);
  const [form, setForm] = useState({ userType_name: '', remarks: '' });

  const fetchUserTypes = async () => {
    try {
      const res = await axios.get(`${Api}/user/view_allUserTypes/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setUserTypes(res.data);
    } catch (err) {
      console.error('Failed to fetch userTypes:', err);
    }
  };

  useEffect(() => {
    fetchUserTypes();
  }, []);

  const filteredUserTypes = userTypes.filter((mat) => {
    if (filter === 'active') return mat.is_active;
    if (filter === 'inactive') return !mat.is_active;
    return true;
  });

  const handleShowModal = (userType = null) => {
    setEditUserType(userType);
    setForm(userType ? {
      userType_name: userType.userType_name,
      remarks: userType.remarks || '',
    } : { userType_name: '', remarks: '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    const url = editUserType
      ? `${Api}/user/update_UserType/${editUserType.id}/`
      : `${Api}/user/create_UserType/`;
    const method = editUserType ? 'put' : 'post';
    try {
      await axios({
        method,
        url,
        data: {
          name: form.userType_name,
          remarks: form.remarks,
          is_active : true
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setShowModal(false);
      fetchUserTypes();
    } catch (err) {
      console.error('Failed to save userType:', err);
    }
  };

  const toggleUserTypeStatus = async (id, action) => {
    try {
      await axios.delete(`${Api}/user/${action}_UserType/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchUserTypes();
    } catch (err) {
      console.error(`Failed to ${action} userType:`, err);
    }
  };

return (
  <div className="d-flex flex-column" style={{ height: '100vh' }}>
    <TopNavbar />
    <div className="d-flex flex-grow-1">
      <AdminSidebar />
      <div className="p-4 flex-grow-1 overflow-auto" style={{ maxHeight: '100%', backgroundColor: '#f8f9fa' }}>
        <Row className="mb-3 align-items-center">
          <Col><h3>UserTypes</h3></Col>
          <Col className="text-end">
            <Button onClick={() => handleShowModal()} variant="primary">+ Add UserType</Button>
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
              <th>Name</th>
              <th>Remarks</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUserTypes.map((mat) => (
              <tr key={mat.id}>
                <td>{mat.name}</td>
                <td>{mat.remarks}</td>
                <td>{mat.is_active ? 'Active' : 'Inactive'}</td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => handleShowModal(mat)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant={mat.is_active ? 'danger' : 'success'}
                    onClick={() => toggleUserTypeStatus(mat.id, mat.is_active ? 'disable' : 'enable')}
                  >
                    {mat.is_active ? 'Disable' : 'Enable'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>{editUserType ? 'Edit' : 'Add'} UserType</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>UserType Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={form.userType_name}
                          onChange={(e) => setForm({ ...form, userType_name: e.target.value })}
                          required
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Remarks</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={form.remarks}
                          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                        />
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave}>
                      {editUserType ? 'Update' : 'Create'}
                    </Button>
                  </Modal.Footer>
                </Modal>
      </div>
    </div>
  </div>
);


}

export default UserTypePage;
