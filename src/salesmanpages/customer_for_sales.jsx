import React, { act, useEffect, useState } from 'react';
import {
  Button, Modal, Form, Row, Col, Alert,
} from 'react-bootstrap';
import axios from 'axios';
import SalesSidebar from './salesmansidebar';
import { Api } from '../api';
import TopNavbar from '../components/TopNavbar';
import { DataGrid } from '@mui/x-data-grid';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import Loader from '../components/Loader';
import { showToast } from '../components/ToastNotify';

function CustomerSalesPage() {
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [form, setForm] = useState({ customer_name: '', remarks: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true)

  const fetchCustomers = async () => {
    try {
      const cid = localStorage.getItem('user_id')
      setLoading(true)
      const res = await axios.get(`${Api}/master/view_activeCustomer/bysalesman/${cid}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setCustomers(res.data);
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers
    .filter((item) => {
      if (filter === 'active') return item.is_active;
      if (filter === 'inactive') return !item.is_active;
      return true;
    })


  const handleShowModal = (customer = null) => {
    setEditCustomer(customer);
    setForm(customer ? {
      customer_name: customer.customer_name,
      remarks: customer.remarks || '',
      address: customer.address || '',
    } : { customer_name: '', remarks: '', address: '' });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    const trimmed = form.customer_name.trim();
    if (trimmed.length < 3 || /^\d+$/.test(trimmed)) {
      setError('Customer name must be at least 3 characters and not all numbers.');
      return;
    }

    const url = editCustomer
      ? `${Api}/master/update_Customer/${editCustomer.id}/`
      : `${Api}/master/create_Customer/`;
    const method = editCustomer ? 'put' : 'post';

    try {
      await axios({
        method,
        url,
        data: {
          customer_name: form.customer_name,
          remarks: form.remarks,
          address: form.address,
          is_active: true,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setShowModal(false);
      fetchCustomers();
      showToast.success(`Sucessfully ${editCustomer ? 'Edited' : 'Created'} ${form.customer_name}`)
    } catch (err) {
      showToast.error(`Failed to ${editCustomer ? 'Edit' : 'Create'}  ${form.customer_name}`)
      console.error('Failed to save customer:', err);
    }
  };

  const toggleStatus = async (id, action) => {
    try {
      await axios.delete(`${Api}/master/${action}_Customer/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchCustomers();
      showToast.success(`Sucessfully ${action}d ${form.customer_name}`)
    } catch (err) {
      console.error(`Failed to ${action} customer:`, err);
      showToast.error(`Failed to ${action} ${form.customer_name}`)

    }
  };

  const columns = [
    { field: 'customer_name', headerName: 'Name', width : 150,  },
    { field: 'address', headerName: 'Address', width : 150,  },
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
        <SalesSidebar />
        {loading ? <Loader/> : 
        <div className="p-4 flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
          <Row className="mb-3 align-items-center">
            <Col><h3>Customers</h3></Col>
            <Col className="text-end">
              <Button onClick={() => handleShowModal()} variant="primary">+ Add</Button>
            </Col>
          </Row>

          {/* Filter Toggle */}
          <ToggleButtonGroup type="radio" name="filter" value={filter} onChange={setFilter} className="mb-3">
            <ToggleButton id="all" value="all" variant="outline-secondary">All</ToggleButton>
            <ToggleButton id="active" value="active" variant="outline-success">Active</ToggleButton>
            <ToggleButton id="inactive" value="inactive" variant="outline-danger">Inactive</ToggleButton>
          </ToggleButtonGroup>

          {/* DataGrid Table */}
          <div style={{ height: 600, width: '100%' }} className="bg-white p-3 rounded shadow-sm">
            <DataGrid
              rows={filteredCustomers}
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
              <Modal.Title>{editCustomer ? 'Edit' : 'Add'} Customer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.customer_name}
                    onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Remarks</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={form.remarks}
                    onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                  />
                </Form.Group>

              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSave}>
                {editCustomer ? 'Update' : 'Create'}
              </Button>
            </Modal.Footer>
          </Modal>
        </div> }
      </div>
    </div>
  );
}

export default CustomerSalesPage;
