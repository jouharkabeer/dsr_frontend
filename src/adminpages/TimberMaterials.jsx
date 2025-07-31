import React, { useEffect, useState } from 'react';
import {
  Button, Modal, Form, Row, Col, Alert, ToggleButtonGroup, ToggleButton
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
import Loader from '../components/Loader';
import { showToast } from '../components/ToastNotify';


function TimberMaterialPage() {
  const [timbermaterials, setTimberMaterials] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editTimberMaterial, setEditTimberMaterial] = useState(null);
  const [form, setForm] = useState({ timbermaterial_name: '', remarks: '', timber_material_catagory_name: '' });
  const [timbermaterialCatagories, setTimberMaterialCatagories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true)

  const fetchTimberMaterials = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${Api}/master/view_allTimberMaterials/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setTimberMaterials(res.data);
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch timber materials:', err);
    }
  };

  const fetchTimberMaterialCatagories = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${Api}/master/view_activeTimberMaterialCategory/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setTimberMaterialCatagories(res.data);
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    fetchTimberMaterials();
    fetchTimberMaterialCatagories();
  }, []);

  const filteredTimberMaterials = timbermaterials
    .filter((mat) => {
      if (filter === 'active') return mat.is_active;
      if (filter === 'inactive') return !mat.is_active;
      return true;
    });

  const handleShowModal = (timbermaterial = null) => {
    setEditTimberMaterial(timbermaterial);
    setForm(timbermaterial ? {
      timbermaterial_name: timbermaterial.timber_material_name,
      timber_material_catagory_name: timbermaterial.timber_material_category,
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
          timber_material_category: form.timber_material_catagory_name,
          is_active: true,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setShowModal(false);
      fetchTimberMaterials();
    } catch (err) {
      console.error('Failed to save timber material:', err);
    }
  };

  const toggleStatus = async (id, action) => {
    try {
      await axios.delete(`${Api}/master/${action}_TimberMaterial/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchTimberMaterials();
      showToast.success(`Sucessfully ${editTimberMaterial ? 'Edited' : 'Created'} ${form.timbermaterial_name}`)
    } catch (err) {
      showToast.error(`Failed to ${editTimberMaterial ? 'Edit' : 'Create'}  ${form.timbermaterial_name}`)
      console.error(`Failed to ${action} timber material:`, err);
    }
  };

  const columns = [
    { field: 'timber_material_name', headerName: 'Name', width : 150,  },
    { field: 'category_name', headerName: 'Category', width : 150,  },
    { field: 'remarks', headerName: 'Remarks', width : 150,  },
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
            <Col><h3>Timber Materials</h3></Col>
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
  rows={filteredTimberMaterials}
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
              <Modal.Title>{editTimberMaterial ? 'Edit' : 'Add'} Timber Material</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form>
                <Form.Group className="mb-2">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={form.timber_material_catagory_name}
                    onChange={(e) => setForm({ ...form, timber_material_catagory_name: e.target.value })}
                    required
                  >
                    <option value="">Select category</option>
                    {timbermaterialCatagories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.timber_material_catagory_name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Timber Material Name</Form.Label>
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
        </div>}
      </div>
    </div>
  );
}

export default TimberMaterialPage;
