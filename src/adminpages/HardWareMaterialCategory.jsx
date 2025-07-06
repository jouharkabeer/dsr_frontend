import React, { useEffect, useState } from 'react';
import {
  Button, Modal, Form, Row, Col, Alert,
} from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from './adminsidebar';
import TopNavbar from '../components/TopNavbar';
import { Api } from '../api';
import { DataGrid } from '@mui/x-data-grid';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

function HardWareMaterialCategoryPage() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ hardware_material_catagory_name: '', remarks: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const res = await axios.get(`${Api}/master/view_allHardWareMaterialCategorys/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredData = data
    .filter((item) => {
      if (filter === 'active') return item.is_active;
      if (filter === 'inactive') return !item.is_active;
      return true;
    })
    .filter((item) =>
      item.hardware_material_catagory_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleShowModal = (item = null) => {
    setEditItem(item);
    setForm(item ? {
      hardware_material_catagory_name: item.hardware_material_catagory_name,
      remarks: item.remarks || '',
    } : { hardware_material_catagory_name: '', remarks: '' });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    const trimmed = form.hardware_material_catagory_name.trim();
    if (trimmed.length < 3 || /^\d+$/.test(trimmed)) {
      setError('Name must be at least 3 characters and not all numbers.');
      return;
    }

    const url = editItem
      ? `${Api}/master/update_HardWareMaterialCategory/${editItem.id}/`
      : `${Api}/master/create_HardWareMaterialCategory/`;
    const method = editItem ? 'put' : 'post';

    try {
      await axios({
        method,
        url,
        data: {
          hardware_material_catagory_name: form.hardware_material_catagory_name,
          remarks: form.remarks,
          is_active: true
        },
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to save:', err);
    }
  };

  const toggleStatus = async (id, action) => {
    try {
      await axios.delete(`${Api}/master/${action}_HardWareMaterialCategory/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      fetchData();
    } catch (err) {
      console.error(`Failed to ${action} item:`, err);
    }
  };

  const columns = [
    { field: 'hardware_material_catagory_name', headerName: 'Name', flex: 1 },
    { field: 'remarks', headerName: 'Remarks', flex: 2 },
    {
      field: 'is_active',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (params.value ? 'Active' : 'Inactive'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
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
        <div className="p-4 flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
          <Row className="mb-3 align-items-center">
            <Col><h3>Hardware Categories</h3></Col>
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
              rows={filteredData}
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
              <Modal.Title>{editItem ? 'Edit' : 'Add'} Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Category Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.hardware_material_catagory_name}
                    onChange={(e) => setForm({ ...form, hardware_material_catagory_name: e.target.value })}
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
                {editItem ? 'Update' : 'Create'}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default HardWareMaterialCategoryPage;
