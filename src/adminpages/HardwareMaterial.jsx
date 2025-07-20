import React, { useEffect, useState } from 'react';
import {
  Button, Modal, Form, Row, Col, Alert,
} from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from './adminsidebar';
import TopNavbar from '../components/TopNavbar';
import { Api } from '../api';
import { DataGrid} from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import Loader from '../components/Loader';

function HardWareMaterialPage() {
  const [hardwarematerials, setHardWareMaterials] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editHardWareMaterial, setEditHardWareMaterial] = useState(null);
  const [form, setForm] = useState({ hardwarematerial_name: '', remarks: '', hardware_material_catagory_name: '' });
  const [hardwarematerialCatagories, setHardWareMaterialCatagories] = useState([]);
  const [error, setError] = useState('');
  const [loaading, setLoading] = useState(true);

  const fetchHardWareMaterials = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${Api}/master/view_allHardWareMaterials/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setHardWareMaterials(res.data);
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch hardware materials:', err);
    }
  };

  const fetchHardWareMaterialCatagories = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${Api}/master/view_activeHardWareMaterialCategory/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setHardWareMaterialCatagories(res.data);
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    fetchHardWareMaterials();
    fetchHardWareMaterialCatagories();
  }, []);

  const filteredHardWareMaterials = hardwarematerials
    .filter((mat) => {
      if (filter === 'active') return mat.is_active;
      if (filter === 'inactive') return !mat.is_active;
      return true;
    });

  const handleShowModal = (hardwarematerial = null) => {
    setEditHardWareMaterial(hardwarematerial);
    setForm(hardwarematerial ? {
      hardwarematerial_name: hardwarematerial.hardware_material_name,
      hardware_material_catagory_name: hardwarematerial.hardware_material_category,
      remarks: hardwarematerial.remarks || '',
    } : { hardwarematerial_name: '', hardware_material_catagory_name: '', remarks: '' });
    setError('');
    setShowModal(true);
  };
  const toggleStatus = async (id, action) => {
    try {
      await axios.delete(`${Api}/master/${action}_HardWareMaterial/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      fetchHardWareMaterials();
    } catch (err) {
      console.error(`Failed to ${action} item:`, err);
    }
  };
  const handleSave = async () => {
    const trimmed = form.hardwarematerial_name.trim();
    if (trimmed.length < 3 || /^\d+$/.test(trimmed)) {
      setError('HardWareMaterial name must be at least 3 characters and not all numbers.');
      return;
    }

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
          hardware_material_category: form.hardware_material_catagory_name,
          is_active: true,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setShowModal(false);
      fetchHardWareMaterials();
    } catch (err) {
      console.error('Failed to save hardware material:', err);
    }
  };

  const columns = [
    { field: 'hardware_material_name', headerName: 'Name', flex : 150 },
    { field: 'category_name', headerName: 'Category', flex : 250 },
    { field: 'remarks', headerName: 'Remarks', flex : 150 },
    {
      field: 'is_active',
      headerName: 'Status',
      flex : 150,
      renderCell: (params) => (params.value ? 'Active' : 'Inactive'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex : 150,
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
        {loaading ? <Loader/> : 
        <div className="p-4 flex-grow-1 overflow-auto" style={{ maxHeight: '100%', backgroundColor: '#f8f9fa' }}>
          <Row className="mb-3 align-items-center">
            <Col><h3>Hardware Materials</h3></Col>
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
  rows={filteredHardWareMaterials}
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
  showToolbar // ✅ NEW: enables full toolbar (search, export, columns)
  slotProps={{
    toolbar: {
      quickFilterProps: { debounceMs: 500 },
    },
  }}
/>

          </div>

          {/* Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>{editHardWareMaterial ? 'Edit' : 'Add'} Hardware Material</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form>
                <Form.Group className="mb-2">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={form.hardware_material_catagory_name}
                    onChange={(e) => setForm({ ...form, hardware_material_catagory_name: e.target.value })}
                    required
                  >
                    <option value="">Select category</option>
                    {hardwarematerialCatagories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.hardware_material_catagory_name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Hardware Material Name</Form.Label>
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
        </div>}
      </div>
    </div>
  );
}

export default HardWareMaterialPage;
