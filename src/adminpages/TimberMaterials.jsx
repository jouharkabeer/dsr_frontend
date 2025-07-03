import React, { useEffect, useState } from 'react';
import {
  Button, Table, Modal, Form, ToggleButtonGroup, ToggleButton, Row, Col, Alert,
} from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from './adminsidebar';
import TopNavbar from '../components/TopNavbar';
import { Api } from '../api';

function TimberMaterialPage() {
  const [timbermaterials, setTimberMaterials] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editTimberMaterial, setEditTimberMaterial] = useState(null);
  const [form, setForm] = useState({ timbermaterial_name: '', remarks: '', timber_material_catagory_name : ''});
  const [timbermaterialCatagories, setTimberMaterialCatagories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading , setLoading] = useState(true)

console.log(localStorage.getItem('access_token'))

  const fetchTimberMaterials = async () => {
    try {
      const res = await axios.get(`${Api}/master/view_allTimberMaterials/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setTimberMaterials(res.data);
    } catch (err) {
      console.error('Failed to fetch timbermaterials:', err);
    }
  };

  const fetchTimberMaterialCatagories = async () => {
  try {
    const res = await axios.get(`${Api}/master/view_activeTimberMaterialCategory/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    setTimberMaterialCatagories(res.data);
    console.log(timbermaterialCatagories)
  } catch (err) {
    console.error('Failed to fetch user types:', err);
  }
};

  useEffect(() => {
    fetchTimberMaterials();
    fetchTimberMaterialCatagories();
    setLoading(false)
    console.log(timbermaterials)
  }, []);

console.log(timbermaterials)
console.log(filter)
  const filteredTimberMaterials = timbermaterials.filter((mat) => {
    if (filter === 'active') return mat.is_active;
    if (filter === 'inactive') return !mat.is_active;
    return true;
  })

      .filter((mat) =>
      mat.timber_material_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
console.log(filteredTimberMaterials)
  const handleShowModal = (timbermaterial = null) => {
    setEditTimberMaterial(timbermaterial);
    setForm(timbermaterial ? {
      timbermaterial_name: timbermaterial.timbermaterial_name,
      timber_material_catagory_name : timbermaterial.timber_material_catagory_name,
      remarks: timbermaterial.remarks || '',
    } : { timbermaterial_name: '', timber_material_catagory_name: '', remarks: '' });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {

    const trimmed = form.timbermaterial_name.trim();
    if (trimmed.length < 3 || /^\d+$/.test(trimmed)) {
      setError('TimberMaterial name must be at least 3 characters and not all numbers.');
      return;
    }
    console.log(error)
    console.log(form)
    const url = editTimberMaterial
      ? `${Api}/master/update_TimberMaterial/${editTimberMaterial.id}/`
      : `${Api}/master/create_TimberMaterial/`;
    const method = editTimberMaterial ? 'put' : 'post';
    try {
      await axios({
        method,
        url,
        data: {
          timber_material_name: form.timbermaterial_name,
          remarks: form.remarks,
          timber_material_category : form.timber_material_catagory_name,
          is_active : true
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setShowModal(false);
      fetchTimberMaterials();
    } catch (err) {
      console.error('Failed to save timbermaterial:', err);
    }
  };

  const toggleTimberMaterialStatus = async (id, action) => {
    try {
      await axios.delete(`${Api}/master/${action}_TimberMaterial/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchTimberMaterials();
    } catch (err) {
      console.error(`Failed to ${action} timbermaterial:`, err);
    }
  };

return (
  <div className="d-flex flex-column" style={{ height: '100vh' }}>
    <TopNavbar />
    <div className="d-flex flex-grow-1">
      <AdminSidebar />
      <div className="p-4 flex-grow-1 overflow-auto" style={{ maxHeight: '100%', backgroundColor: '#f8f9fa' }}>
        <Row className="mb-3 align-items-center">
          <Col><h3>TimberMaterials</h3></Col>
          <Col className="text-end">
            <Button onClick={() => handleShowModal()} variant="primary">+ Add TimberMaterial</Button>
          </Col>
        </Row>
          <Form.Control
            type="text"
            placeholder="Search by TimberMaterial name"
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
            {filteredTimberMaterials.map((mat) => (
              <tr key={mat.id}>
                <td>{mat.timber_material_name}</td>
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
                    onClick={() => toggleTimberMaterialStatus(mat.id, mat.is_active ? 'disable' : 'enable')}
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
            <Modal.Title>{editTimberMaterial ? 'Edit' : 'Add'} TimberMaterial</Modal.Title>
          </Modal.Header>
              {error && <Alert variant="danger">{error}</Alert>}
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={form.timber_material_catagory_name}
                  onChange={(e) => setForm({ ...form, timber_material_catagory_name: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {timbermaterialCatagories.map((type) => (
                    <option key={type.id} value={type.id}>{type.timber_material_catagory_name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>TimberMaterial Name</Form.Label>
                <Form.Control
                  type="text"
                  value={form.timbermaterial_name}
                  onChange={(e) => setForm({ ...form, timbermaterial_name: e.target.value })}
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
              {editTimberMaterial ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  </div>  

);


}

export default TimberMaterialPage;
