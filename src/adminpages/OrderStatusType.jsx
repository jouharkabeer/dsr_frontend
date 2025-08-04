import React, { useEffect, useState } from 'react';
import {
  Button, Modal, Form, Row, Col, Alert, ToggleButtonGroup, ToggleButton
} from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from './adminsidebar';
import TopNavbar from '../components/TopNavbar';
import { Api } from '../api';
import { DataGrid } from '@mui/x-data-grid';
import Loader from '../components/Loader';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { showToast } from '../components/ToastNotify';

function OrderStatusTypePage() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    order_type_name: '',
    text_color: '#000000',
    text_bg: '#ffffff',
    remarks: '',
  });
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${Api}/master/view_allOrderStatusTypes/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      setData(res.data);
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch:', err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredData = data
    .filter((p) => {
      if (filter === 'active') return p.is_active;
      if (filter === 'inactive') return !p.is_active;
      return true;
    })

  const handleShowModal = (item = null) => {
    setEditItem(item);
    setForm(item ? {
      order_type_name: item.order_type_name,
      text_color: item.text_color || '#000000',
      text_bg: item.text_bg || '#ffffff',
      remarks: item.remarks || '',
    } : {
      order_type_name: '',
      text_color: '#000000',
      text_bg: '#ffffff',
      remarks: '',
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    const trimmed = form.order_type_name.trim();
    if (trimmed.length < 3 || /^\d+$/.test(trimmed)) {
      setError('Name must be at least 3 characters and not all numbers.');
      return;
    }

    const url = editItem
      ? `${Api}/master/update_OrderStatusType/${editItem.id}/`
      : `${Api}/master/create_OrderStatusType/`;
    const method = editItem ? 'put' : 'post';

    try {
      await axios({
        method,
        url,
        data: {
          ...form,
          is_active: true,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setShowModal(false);
      fetchData();
      showToast.success(`Sucessfully ${editItem ? 'Edited' : 'Created'} ${form.order_type_name}`)
    } catch (err) {
      showToast.error(`Failed to ${editItem ? 'Edit' : 'Create'}  ${form.order_type_name}`)
      console.error('Failed to save:', err);
    }
  };

  const toggleStatus = async (id, action) => {
    try {
      await axios.delete(`${Api}/master/${action}_OrderStatusType/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchData();
      showToast.success(`Sucessfully ${action}d ${form.order_type_name}`)
    } catch (err) {
      showToast.error(`Failed to ${action} ${form.order_type_name}`)
      console.error(`Failed to ${action}:`, err);
    }
  };

  const columns = [
    { field: 'order_type_name', headerName: 'Name', width : 150,  },
    {
      field: 'text_color',
      headerName: 'Text Color',
      width : 150, 
      renderCell: (params) => (
        <span style={{ color: params.value }}>{params.value}</span>
      )
    },
    {
      field: 'text_bg',
      headerName: 'Background',
      width : 150, 
      renderCell: (params) => (
        <span style={{
          backgroundColor: params.value,
          padding: '2px 6px',
          borderRadius: '4px'
        }}>{params.value}</span>
      )
    },
    { field: 'remarks', headerName: 'Remarks', width : 150,  },
    {
      field: 'is_active',
      headerName: 'Status',
      width : 150, 
      renderCell: (params) => (params.value ? 'Active' : 'Inactive')
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
            <Col><h3>Order Status Types</h3></Col>
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
              <Modal.Title>{editItem ? 'Edit' : 'Add'} OrderStatusType</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>OrderStatusType Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.order_type_name}
                    onChange={(e) => setForm({ ...form, order_type_name: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Text Color</Form.Label>
                  <Form.Control
                    type="color"
                    value={form.text_color}
                    onChange={(e) => setForm({ ...form, text_color: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Background Color</Form.Label>
                  <Form.Control
                    type="color"
                    value={form.text_bg}
                    onChange={(e) => setForm({ ...form, text_bg: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
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
        </div>}
      </div>
    </div>
  );
}

export default OrderStatusTypePage;
