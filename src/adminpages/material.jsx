import React, { useEffect, useState } from 'react';
import {
  Button, Table, Modal, Form, ToggleButtonGroup, ToggleButton, Row, Col, Alert,
} from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from './adminsidebar';
import TopNavbar from '../components/TopNavbar';
import { Api } from '../api';
function MaterialPage() {
  const [materials, setMaterials] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editMaterial, setEditMaterial] = useState(null);
  const [form, setForm] = useState({ material_name: '', remarks: '', material_category : ''});
  const [materialCatagories, setMaterialCatagories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');


  const fetchMaterials = async () => {
    try {
      const res = await axios.get(`${Api}/master/view_allMaterials/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setMaterials(res.data);
    } catch (err) {
      console.error('Failed to fetch materials:', err);
    }
  };

  const fetchMaterialCatagories = async () => {
  try {
    const res = await axios.get(`${Api}/master/view_activeMaterialCategory/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    setMaterialCatagories(res.data);
    console.log(materialCatagories)
  } catch (err) {
    console.error('Failed to fetch user types:', err);
  }
};

  useEffect(() => {
    fetchMaterials();
    fetchMaterialCatagories();
  }, []);

console.log(materialCatagories)

  const filteredMaterials = materials.filter((mat) => {
    if (filter === 'active') return mat.is_active;
    if (filter === 'inactive') return !mat.is_active;
    return true;
  })
      .filter((mat) =>
      mat.material_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
console.log(filteredMaterials)
  const handleShowModal = (material = null) => {
    setEditMaterial(material);
    setForm(material ? {
      material_name: material.material_name,
      material_category : material.material_category,
      remarks: material.remarks || '',
    } : { material_name: '', material_category: '', remarks: '' });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {

    const trimmed = form.material_name.trim();
    if (trimmed.length < 3 || /^\d+$/.test(trimmed)) {
      setError('Material name must be at least 3 characters and not all numbers.');
      return;
    }
    console.log(error)
    const url = editMaterial
      ? `${Api}/master/update_Material/${editMaterial.id}/`
      : `${Api}/master/create_Material/`;
    const method = editMaterial ? 'put' : 'post';
    try {
      await axios({
        method,
        url,
        data: {
          material_name: form.material_name,
          remarks: form.remarks,
          material_category : form.material_category,
          is_active : true
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setShowModal(false);
      fetchMaterials();
    } catch (err) {
      console.error('Failed to save material:', err);
    }
  };

  const toggleMaterialStatus = async (id, action) => {
    try {
      await axios.delete(`${Api}/master/${action}_Material/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchMaterials();
    } catch (err) {
      console.error(`Failed to ${action} material:`, err);
    }
  };

return (
  <div className="d-flex flex-column" style={{ height: '100vh' }}>
    <TopNavbar />
    <div className="d-flex flex-grow-1">
      <AdminSidebar />
      <div className="p-4 flex-grow-1 overflow-auto" style={{ maxHeight: '100%', backgroundColor: '#f8f9fa' }}>
        <Row className="mb-3 align-items-center">
          <Col><h3>Materials</h3></Col>
          <Col className="text-end">
            <Button onClick={() => handleShowModal()} variant="primary">+ Add Material</Button>
          </Col>
        </Row>
          <Form.Control
            type="text"
            placeholder="Search by Material name"
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
            {filteredMaterials.map((mat) => (
              <tr key={mat.id}>
                <td>{mat.material_name}</td>
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
                    onClick={() => toggleMaterialStatus(mat.id, mat.is_active ? 'disable' : 'enable')}
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
            <Modal.Title>{editMaterial ? 'Edit' : 'Add'} Material</Modal.Title>
          </Modal.Header>
              {error && <Alert variant="danger">{error}</Alert>}
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={form.material_category}
                  onChange={(e) => setForm({ ...form, material_category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {materialCatagories.map((type) => (
                    <option key={type.id} value={type.id}>{type.material_catagory_name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Material Name</Form.Label>
                <Form.Control
                  type="text"
                  value={form.material_name}
                  onChange={(e) => setForm({ ...form, material_name: e.target.value })}
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
              {editMaterial ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  </div>
);


}

export default MaterialPage;
