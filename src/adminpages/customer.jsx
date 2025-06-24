import React, { useEffect, useState } from 'react';
import {
  Button, Table, Modal, Form, ToggleButtonGroup, ToggleButton, Row, Col,
} from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from './adminsidebar';
import { Api } from '../api';

function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [form, setForm] = useState({ customer_name: '', remarks: '' });

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${Api}/master/view_allCustomers/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setCustomers(res.data);
      console.log(customers)
    } catch (err) {
      console.error('Failed to fetch Customers:', err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((mat) => {
    if (filter === 'active') return mat.is_active;
    if (filter === 'inactive') return !mat.is_active;
    return true;
  });

  const handleShowModal = (customer = null) => {
    setEditCustomer(customer);
    setForm(customer ? {
      customer_name: customer.customer_name,
      remarks: customer.remarks || '',
    } : { customer_name: '', remarks: '' });
    setShowModal(true);
  };

  const handleSave = async () => {
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
          is_active : true
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setShowModal(false);
      fetchCustomers();
    } catch (err) {
      console.error('Failed to save Customer:', err);
    }
  };

  const toggleCustomerStatus = async (id, action) => {
    try {
      await axios.delete(`${Api}/master/${action}_Customer/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchCustomers();
    } catch (err) {
      console.error(`Failed to ${action} Customer:`, err);
    }
  };

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="p-4 flex-grow-1">
        <Row className="mb-3 align-items-center">
          <Col><h3>Customers</h3></Col>
          <Col className="text-end">
            <Button onClick={() => handleShowModal()} variant="primary">+ Add Customer</Button>
          </Col>
        </Row>

        <ToggleButtonGroup type="radio" name="filter" value={filter} onChange={setFilter} className="mb-3">
          <ToggleButton id="all" value="all" variant="outline-secondary">All</ToggleButton>
          <ToggleButton id="active" value="active" variant="outline-success">Active</ToggleButton>
          <ToggleButton id="inactive" value="inactive" variant="outline-danger">Inactive</ToggleButton>
        </ToggleButtonGroup>

        <Table bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Remarks</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((mat) => (
              <tr key={mat.id}>
                <td>{mat.customer_name}</td>
                <td>{mat.address}</td>
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
                    onClick={() => toggleCustomerStatus(mat.id, mat.is_active ? 'disable' : 'enable')}
                  >
                    {mat.is_active ? 'Disable' : 'Enable'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Add/Edit Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editCustomer ? 'Edit' : 'Add'} Customer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
              {editCustomer ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default CustomerPage;
