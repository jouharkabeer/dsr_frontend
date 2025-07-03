import React, { useEffect, useState } from 'react';
import {
  Button, Table, Modal, Form, ToggleButtonGroup, ToggleButton, Row, Col, Alert,
} from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from './adminsidebar';
import TopNavbar from '../components/TopNavbar';
import { Api } from '../api';

function HardWareMaterialPage() {
  const [hardwarematerials, setHardWareMaterials] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editHardWareMaterial, setEditHardWareMaterial] = useState(null);
  const [form, setForm] = useState({ hardwarematerial_name: '', remarks: '', hardware_material_catagory_name : ''});
  const [hardwarematerialCatagories, setHardWareMaterialCatagories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading , setLoading] = useState(true)

console.log(localStorage.getItem('access_token'))

  const fetchHardWareMaterials = async () => {
    try {
      const res = await axios.get(`${Api}/master/view_allHardWareMaterials/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setHardWareMaterials(res.data);
    } catch (err) {
      console.error('Failed to fetch hardwarematerials:', err);
    }
  };

  const fetchHardWareMaterialCatagories = async () => {
  try {
    const res = await axios.get(`${Api}/master/view_activeHardWareMaterialCategory/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    setHardWareMaterialCatagories(res.data);
    console.log(hardwarematerialCatagories)
  } catch (err) {
    console.error('Failed to fetch user types:', err);
  }
};

  useEffect(() => {
    fetchHardWareMaterials();
    fetchHardWareMaterialCatagories();
    setLoading(false)
    console.log(hardwarematerials)
  }, []);

console.log(hardwarematerials)
console.log(filter)
  const filteredHardWareMaterials = hardwarematerials.filter((mat) => {
    if (filter === 'active') return mat.is_active;
    if (filter === 'inactive') return !mat.is_active;
    return true;
  })

      .filter((mat) =>
      mat.hardware_material_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
console.log(filteredHardWareMaterials)
  const handleShowModal = (hardwarematerial = null) => {
    setEditHardWareMaterial(hardwarematerial);
    setForm(hardwarematerial ? {
      hardwarematerial_name: hardwarematerial.hardwarematerial_name,
      hardware_material_catagory_name : hardwarematerial.hardware_material_catagory_name,
      remarks: hardwarematerial.remarks || '',
    } : { hardwarematerial_name: '', hardware_material_catagory_name: '', remarks: '' });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {

    const trimmed = form.hardwarematerial_name.trim();
    if (trimmed.length < 3 || /^\d+$/.test(trimmed)) {
      setError('HardWareMaterial name must be at least 3 characters and not all numbers.');
      return;
    }
    console.log(error)
    console.log(form)
    const url = editHardWareMaterial
      ? `${Api}/master/update_HardWareMaterial/${editHardWareMaterial.id}/`
      : `${Api}/master/create_HardWareMaterial/`;
    const method = editHardWareMaterial ? 'put' : 'post';
    try {
      await axios({
        method,
        url,
        data: {
          hardware_material_name: form.hardwarematerial_name,
          remarks: form.remarks,
          hardware_material_category : form.hardware_material_catagory_name,
          is_active : true
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setShowModal(false);
      fetchHardWareMaterials();
    } catch (err) {
      console.error('Failed to save hardwarematerial:', err);
    }
  };

  const toggleHardWareMaterialStatus = async (id, action) => {
    try {
      await axios.delete(`${Api}/master/${action}_HardWareMaterial/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchHardWareMaterials();
    } catch (err) {
      console.error(`Failed to ${action} hardwarematerial:`, err);
    }
  };

return (
  <div className="d-flex flex-column" style={{ height: '100vh' }}>
    <TopNavbar />
    <div className="d-flex flex-grow-1">
      <AdminSidebar />
      <div className="p-4 flex-grow-1 overflow-auto" style={{ maxHeight: '100%', backgroundColor: '#f8f9fa' }}>
        <Row className="mb-3 align-items-center">
          <Col><h3>HardWareMaterials</h3></Col>
          <Col className="text-end">
            <Button onClick={() => handleShowModal()} variant="primary">+ Add HardWareMaterial</Button>
          </Col>
        </Row>
          <Form.Control
            type="text"
            placeholder="Search by HardWareMaterial name"
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
          <thead className="">
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Remarks</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHardWareMaterials.map((mat) => (
              <tr key={mat.id}>
                <td>{mat.hardware_material_name}</td>
                <td>{mat.category_name}</td>
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
                    onClick={() => toggleHardWareMaterialStatus(mat.id, mat.is_active ? 'disable' : 'enable')}
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
            <Modal.Title>{editHardWareMaterial ? 'Edit' : 'Add'} HardWareMaterial</Modal.Title>
          </Modal.Header>
              {error && <Alert variant="danger">{error}</Alert>}
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={form.hardware_material_catagory_name}
                  onChange={(e) => setForm({ ...form, hardware_material_catagory_name: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {hardwarematerialCatagories.map((type) => (
                    <option key={type.id} value={type.id}>{type.hardware_material_catagory_name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>HardWareMaterial Name</Form.Label>
                <Form.Control
                  type="text"
                  value={form.hardwarematerial_name}
                  onChange={(e) => setForm({ ...form, hardwarematerial_name: e.target.value })}
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
              {editHardWareMaterial ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  </div>  

);


}

export default HardWareMaterialPage;
