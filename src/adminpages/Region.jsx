import React, { useEffect, useState } from 'react';
import {
  Button, Modal, Form, Row, Col, Alert,
} from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from './adminsidebar';
import TopNavbar from '../components/TopNavbar';
import { Api } from '../api';
import { DataGrid } from '@mui/x-data-grid';

function RegionPage() {
  const [regiones, setRegiones] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editRegion, setEditRegion] = useState(null);
  const [form, setForm] = useState({ region_name: '', remarks: '' });
  const [error, setError] = useState('');

  const fetchRegiones = async () => {
    try {
      const res = await axios.get(`${Api}/master/view_allRegions/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setRegiones(res.data);
    } catch (err) {
      console.error('Failed to fetch regiones:', err);
    }
  };

  useEffect(() => {
    fetchRegiones();
  }, []);

  const filteredRegiones = regiones.filter((b) => {
    if (filter === 'active') return b.is_active;
    if (filter === 'inactive') return !b.is_active;
    return true;
  });

  const handleShowModal = (region = null) => {
    setEditRegion(region);
    setForm(region ? {
      region_name: region.region_name,
      remarks: region.remarks || '',
    } : { region_name: '', remarks: '' });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    const trimmed = form.region_name.trim();
    if (trimmed.length < 3 || /^\d+$/.test(trimmed)) {
      setError('Region name must be at least 3 characters and not all numbers.');
      return;
    }

    const url = editRegion
      ? `${Api}/master/update_Region/${editRegion.id}/`
      : `${Api}/master/create_Region/`;
    const method = editRegion ? 'put' : 'post';
    try {
      await axios({
        method,
        url,
        data: {
          region_name: form.region_name,
          remarks: form.remarks,
          is_active: true
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setShowModal(false);
      fetchRegiones();
    } catch (err) {
      console.error('Failed to save region:', err);
    }
  };

  const toggleRegionStatus = async (id, action) => {
    try {
      await axios.delete(`${Api}/master/${action}_Region/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchRegiones();
    } catch (err) {
      console.error(`Failed to ${action} region:`, err);
    }
  };

  const columns = [
    { field: 'region_name', headerName: 'Name', flex: 1 },
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
      filterable: false,
      renderCell: (params) => (
        <>
          <Button
            size="sm"
            variant="warning"
            className="me-2"
            onClick={() => handleShowModal(params.row)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant={params.row.is_active ? 'danger' : 'success'}
            onClick={() => toggleRegionStatus(params.row.id, params.row.is_active ? 'disable' : 'enable')}
          >
            {params.row.is_active ? 'Disable' : 'Enable'}
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="d-flex flex-column" style={{ height: '100vh' }}>
      <TopNavbar />
      <div className="d-flex flex-grow-1">
        <AdminSidebar />
        <div className="p-4 flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
          <Row className="mb-3 align-items-center">
            <Col><h3>Regiones</h3></Col>
            <Col className="text-end">
              <Button onClick={() => handleShowModal()} variant="primary">+ Add Region</Button>
            </Col>
          </Row>

          <Form.Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ maxWidth: '200px' }}
            className="mb-3"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Form.Select>

          <div style={{ height: 600, width: '100%' }} className="bg-white p-3 rounded shadow-sm">
            <DataGrid
              rows={filteredRegiones}
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

          {/* Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>{editRegion ? 'Edit' : 'Add'} Region</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Region Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.region_name}
                    onChange={(e) => setForm({ ...form, region_name: e.target.value })}
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
                {editRegion ? 'Update' : 'Create'}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default RegionPage;