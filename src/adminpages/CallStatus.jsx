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
import Loader from '../components/Loader';

function CallStatusPage() {
  const [callStatuses, setCallStatuses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editCallStatus, setEditCallStatus] = useState(null);
  const [form, setForm] = useState({ call_status_name: '', remarks: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true)

  const fetchCallStatuses = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${Api}/master/view_allCallStatuss/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setCallStatuses(res.data);
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch call statuses:', err);
    }
  };

  useEffect(() => {
    fetchCallStatuses();
  }, []);

  const filteredCallStatuses = callStatuses.filter((item) => {
    if (filter === 'active') return item.is_active;
    if (filter === 'inactive') return !item.is_active;
    return true;
  });

  const handleShowModal = (item = null) => {
    setEditCallStatus(item);
    setForm(item ? {
      call_status_name: item.call_status_name,
      remarks: item.remarks || '',
    } : { call_status_name: '', remarks: '' });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    const trimmed = form.call_status_name.trim();
    if (trimmed.length < 3 || /^\d+$/.test(trimmed)) {
      setError('CallStatus name must be at least 3 characters and not all numbers.');
      return;
    }

    const url = editCallStatus
      ? `${Api}/master/update_CallStatus/${editCallStatus.id}/`
      : `${Api}/master/create_CallStatus/`;
    const method = editCallStatus ? 'put' : 'post';

    try {
      await axios({
        method,
        url,
        data: {
          call_status_name: form.call_status_name,
          remarks: form.remarks,
          is_active: true
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setShowModal(false);
      fetchCallStatuses();
    } catch (err) {
      console.error('Failed to save call status:', err);
    }
  };

  const toggleStatus = async (id, action) => {
    try {
      await axios.delete(`${Api}/master/${action}_CallStatus/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchCallStatuses();
    } catch (err) {
      console.error(`Failed to ${action} call status:`, err);
    }
  };

  const columns = [
    { field: 'call_status_name', headerName: 'Name', width : 150,  },
    { field: 'remarks', headerName: 'Remarks', flex: 2 },
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
        <div className="p-4 flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
          <Row className="mb-3 align-items-center">
            <Col><h3>Call Statuses</h3></Col>
            <Col className="text-end">
              <Button onClick={() => handleShowModal()} variant="primary">+ Add Call Status</Button>
            </Col>
          </Row>

          {/* Toggle Filter */}
          <ToggleButtonGroup type="radio" name="filter" value={filter} onChange={setFilter} className="mb-3">
            <ToggleButton id="filter-all" value="all" variant="outline-secondary">All</ToggleButton>
            <ToggleButton id="filter-active" value="active" variant="outline-success">Active</ToggleButton>
            <ToggleButton id="filter-inactive" value="inactive" variant="outline-danger">Inactive</ToggleButton>
          </ToggleButtonGroup>

          {/* DataGrid */}
          <div style={{ height: 600, width: '100%' }} className="bg-white p-3 rounded shadow-sm">
            <DataGrid
              rows={filteredCallStatuses}
              columns={columns}
              getRowId={(row) => row.id}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } }
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
              <Modal.Title>{editCallStatus ? 'Edit' : 'Add'} Call Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>CallStatus Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.call_status_name}
                    onChange={(e) => setForm({ ...form, call_status_name: e.target.value })}
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
                {editCallStatus ? 'Update' : 'Create'}
              </Button>
            </Modal.Footer>
          </Modal>
        </div> }
      </div>
    </div>
  );
}

export default CallStatusPage;
