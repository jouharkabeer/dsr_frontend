
import React, { useEffect, useState } from 'react';
import {
  Button, Modal, Form, Row, Col, Alert, ToggleButtonGroup, ToggleButton,
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

function PaymentMethodPage() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editPaymentMethod, setEditPaymentMethod] = useState(null);
  const [form, setForm] = useState({ payment_type_name: '', remarks: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${Api}/master/view_allPaymentMethods/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setPaymentMethods(res.data);
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch paymentMethods:', err);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const filteredPaymentMethods = paymentMethods
    .filter((mat) => {
      if (filter === 'active') return mat.is_active;
      if (filter === 'inactive') return !mat.is_active;
      return true;
    })

  const handleShowModal = (paymentMethod = null) => {
    setEditPaymentMethod(paymentMethod);
    setForm(paymentMethod ? {
      payment_type_name: paymentMethod.payment_type_name,
      remarks: paymentMethod.remarks || '',
    } : { payment_type_name: '', remarks: '' });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    const trimmed = form.payment_type_name.trim();
    if (trimmed.length < 3 || /^\d+$/.test(trimmed)) {
      setError('PaymentMethod name must be at least 3 characters and not all numbers.');
      return;
    }

    const url = editPaymentMethod
      ? `${Api}/master/update_PaymentMethod/${editPaymentMethod.id}/`
      : `${Api}/master/create_PaymentMethod/`;
    const method = editPaymentMethod ? 'put' : 'post';
    try {
      await axios({
        method,
        url,
        data: {
          payment_type_name: form.payment_type_name,
          remarks: form.remarks,
          is_active: true
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setShowModal(false);
      fetchPaymentMethods();
    } catch (err) {
      console.error('Failed to save paymentMethod:', err);
    }
  };

  const togglePaymentMethodStatus = async (id, action) => {
    try {
      await axios.delete(`${Api}/master/${action}_PaymentMethod/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchPaymentMethods();
    } catch (err) {
      console.error(`Failed to ${action} paymentMethod:`, err);
    }
  };

  const columns = [
    { field: 'payment_type_name', headerName: 'Name', width : 150,  },
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
        <div
          className="p-4 flex-grow-1 overflow-auto"
          style={{ backgroundColor: '#f8f9fa' }}
        >
          <Row className="mb-3 align-items-center">
            <Col><h3>Payment Methods</h3></Col>
            <Col className="text-end">
              <Button onClick={() => handleShowModal()} variant="primary">+ Add</Button>
            </Col>
          </Row>


          <ToggleButtonGroup
            type="radio"
            name="filter"
            value={filter}
            onChange={setFilter}
            className="mb-3"
          >
            <ToggleButton id="all" value="all" variant="outline-secondary">All</ToggleButton>
            <ToggleButton id="active" value="active" variant="outline-success">Active</ToggleButton>
            <ToggleButton id="inactive" value="inactive" variant="outline-danger">Inactive</ToggleButton>
          </ToggleButtonGroup>

          <div style={{ height: 600, width: '100%' }} className="bg-white p-3 rounded shadow-sm">
            <DataGrid
              rows={filteredPaymentMethods}
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
              <Modal.Title>{editPaymentMethod ? 'Edit' : 'Add'} PaymentMethod</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>PaymentMethod Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.payment_type_name}
                    onChange={(e) =>
                      setForm({ ...form, payment_type_name: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Remarks</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={form.remarks}
                    onChange={(e) =>
                      setForm({ ...form, remarks: e.target.value })
                    }
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSave}>
                {editPaymentMethod ? 'Update' : 'Create'}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>}
      </div>
    </div>
  );
}

export default PaymentMethodPage;