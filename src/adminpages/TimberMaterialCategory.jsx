
import React, { useEffect, useState } from 'react';
import {
  Button, Table, Modal, Form, ToggleButtonGroup, ToggleButton, Row, Col, Alert,
} from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from './adminsidebar';
import TopNavbar from '../components/TopNavbar';
import { Api } from '../api';

function TimberMaterialCategoryPage() {
  const [timberMaterialCategorys, setTimberMaterialCategorys] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editTimberMaterialCategory, setEditTimberMaterialCategory] = useState(null);
  const [form, setForm] = useState({ timber_material_catagory_name: '', remarks: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const fetchTimberMaterialCategorys = async () => {
    try {
      const res = await axios.get(`${Api}/master/view_allTimberMaterialCategorys/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setTimberMaterialCategorys(res.data);
    } catch (err) {
      console.error('Failed to fetch timberMaterialCategoryes:', err);
    }
  };

  useEffect(() => {
    fetchTimberMaterialCategorys();
  }, []);

  const filteredTimberMaterialCategorys = timberMaterialCategorys
    .filter((mat) => {
      if (filter === 'active') return mat.is_active;
      if (filter === 'inactive') return !mat.is_active;
      return true;
    })
    .filter((mat) =>
      mat.timber_material_catagory_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleShowModal = (timberMaterialCategory = null) => {
    setEditTimberMaterialCategory(timberMaterialCategory);
    setForm(timberMaterialCategory ? {
      timber_material_catagory_name: timberMaterialCategory.timber_material_catagory_name,
      remarks: timberMaterialCategory.remarks || '',
    } : { timber_material_catagory_name: '', remarks: '' });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    // Validation
    const trimmed = form.timber_material_catagory_name.trim();
    if (trimmed.length < 3 || /^\d+$/.test(trimmed)) {
      setError('TimberMaterialCategory name must be at least 3 characters and not all numbers.');
      return;
    }

    const url = editTimberMaterialCategory
      ? `${Api}/master/update_TimberMaterialCategory/${editTimberMaterialCategory.id}/`
      : `${Api}/master/create_TimberMaterialCategory/`;
    const method = editTimberMaterialCategory ? 'put' : 'post';
    try {
      await axios({
        method,
        url,
        data: {
          timber_material_catagory_name: form.timber_material_catagory_name,
          remarks: form.remarks,
          is_active: true
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setShowModal(false);
      fetchTimberMaterialCategorys();
    } catch (err) {
      console.error('Failed to save timberMaterialCategory:', err);
    }
  };

  const toggleTimberMaterialCategoryStatus = async (id, action) => {
    try {
      await axios.delete(`${Api}/master/${action}_TimberMaterialCategory/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchTimberMaterialCategorys();
    } catch (err) {
      console.error(`Failed to ${action} timberMaterialCategory:`, err);
    }
  };

  return (
    <div className="d-flex flex-column" style={{ height: '100vh' }}>
      <TopNavbar />
      <div className="d-flex flex-grow-1">
        <AdminSidebar />
        <div className="p-4 flex-grow-1 overflow-auto" style={{ maxHeight: '100%', backgroundColor: '#f8f9fa' }}>
          <Row className="mb-3 align-items-center">
            <Col><h3>Material Categories</h3></Col>
            <Col className="text-end">
              <Button onClick={() => handleShowModal()} variant="primary">+ Add TimberMaterialCategory</Button>
            </Col>
          </Row>

          <Form.Control
            type="text"
            placeholder="Search by Material Category name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
            style={{ maxWidth: '300px' }}
          />

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
              {filteredTimberMaterialCategorys.map((mat) => (
                <tr key={mat.id}>
                  <td>{mat.timber_material_catagory_name}</td>
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
                      onClick={() => toggleTimberMaterialCategoryStatus(mat.id, mat.is_active ? 'disable' : 'enable')}
                    >
                      {mat.is_active ? 'Disable' : 'Enable'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>{editTimberMaterialCategory ? 'Edit' : 'Add'} TimberMaterialCategory</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>TimberMaterialCategory Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.timber_material_catagory_name}
                    onChange={(e) => setForm({ ...form, timber_material_catagory_name: e.target.value })}
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
                {editTimberMaterialCategory ? 'Update' : 'Create'}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default TimberMaterialCategoryPage;
