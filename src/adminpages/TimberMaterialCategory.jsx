import React, { useEffect, useState } from 'react';
import {
  Button, Modal, Form, ToggleButtonGroup, ToggleButton, Row, Col, Alert
} from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from './adminsidebar';
import TopNavbar from '../components/TopNavbar';
import { Api } from '../api';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import Loader from '../components/Loader';

function TimberMaterialCategoryPage() {
  const [timberMaterialCategorys, setTimberMaterialCategorys] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editTimberMaterialCategory, setEditTimberMaterialCategory] = useState(null);
  const [form, setForm] = useState({ timber_material_catagory_name: '', remarks: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true)

  const fetchTimberMaterialCategorys = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${Api}/master/view_allTimberMaterialCategorys/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setTimberMaterialCategorys(res.data);
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    fetchTimberMaterialCategorys();
  }, []);

  const filteredData = timberMaterialCategorys
    .filter((mat) => {
      if (filter === 'active') return mat.is_active;
      if (filter === 'inactive') return !mat.is_active;
      return true;
    })
    .filter((mat) =>
      mat.timber_material_catagory_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleShowModal = (item = null) => {
    setEditTimberMaterialCategory(item);
    setForm(item ? {
      timber_material_catagory_name: item.timber_material_catagory_name,
      remarks: item.remarks || '',
    } : { timber_material_catagory_name: '', remarks: '' });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    const trimmed = form.timber_material_catagory_name.trim();
    if (trimmed.length < 3 || /^\d+$/.test(trimmed)) {
      setError('Name must be at least 3 characters and not all numbers.');
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
          is_active: true,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setShowModal(false);
      fetchTimberMaterialCategorys();
    } catch (err) {
      console.error('Failed to save category:', err);
    }
  };

  const toggleStatus = async (id, action) => {
    try {
      await axios.delete(`${Api}/master/${action}_TimberMaterialCategory/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchTimberMaterialCategorys();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const columns = [
    { field: 'timber_material_catagory_name', headerName: 'Name', flex : 1, },
    { field: 'remarks', headerName: 'Remarks', flex: 2 },
    {
      field: 'is_active',
      headerName: 'Status',
      flex : 1,
      renderCell: (params) => (
        <span>{params.row.is_active ? 'Active' : 'Inactive'}</span>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex : 1,
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
        <div className="p-4 flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
          <Row className="mb-3 align-items-center">
            <Col><h3>Timber Categories</h3></Col>
            <Col className="text-end">
              <Button onClick={() => handleShowModal()} variant="primary">+ Add</Button>
            </Col>
          </Row>

          <ToggleButtonGroup type="radio" name="filter" value={filter} onChange={setFilter} className="mb-3">
            <ToggleButton id="all" value="all" variant="outline-secondary">All</ToggleButton>
            <ToggleButton id="active" value="active" variant="outline-success">Active</ToggleButton>
            <ToggleButton id="inactive" value="inactive" variant="outline-danger">Inactive</ToggleButton>
          </ToggleButtonGroup>

          <div style={{ height: 500, background: 'white' }} className="shadow-sm rounded">
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
              <Modal.Title>{editTimberMaterialCategory ? 'Edit' : 'Add'} Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Category Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.timber_material_catagory_name}
                    onChange={(e) => {
                      setForm({ ...form, timber_material_catagory_name: e.target.value });
                      if (e.target.value.trim().length >= 3 && !/^\d+$/.test(e.target.value.trim())) {
                        setError('');
                      }
                    }}
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
        </div>}
      </div>
    </div>
  );
}

export default TimberMaterialCategoryPage;
