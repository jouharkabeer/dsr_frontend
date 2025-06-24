import React, { useEffect, useState } from 'react';
import {
  Button, Table, Modal, Form, ToggleButtonGroup, ToggleButton, Row, Col
} from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from './adminsidebar';
import TopNavbar from '../components/TopNavbar';
import { Api } from '../api';

function OrderStatusTypePage() {
  const [orderStatusTypes, setOrderStatusTypes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editOrderStatusType, setEditOrderStatusType] = useState(null);
  const [form, setForm] = useState({
    order_type_name: '',
    text_color: '#000000',
    text_bg: '#ffffff',
    remarks: '',
  });

  const fetchOrderStatusTypes = async () => {
    try {
      const res = await axios.get(`${Api}/master/view_allOrderStatusTypes/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setOrderStatusTypes(res.data);
    } catch (err) {
      console.error('Failed to fetch orderStatusTypes:', err);
    }
  };

  useEffect(() => {
    fetchOrderStatusTypes();
  }, []);

  const filteredOrderStatusTypes = orderStatusTypes.filter((p) => {
    if (filter === 'active') return p.is_active;
    if (filter === 'inactive') return !p.is_active;
    return true;
  });

  const handleShowModal = (orderStatusType = null) => {
    setEditOrderStatusType(orderStatusType);
    setForm(orderStatusType ? {
      order_type_name: orderStatusType.order_type_name,
      text_color: orderStatusType.text_color || '#000000',
      text_bg: orderStatusType.text_bg || '#ffffff',
      remarks: orderStatusType.remarks || '',
    } : {
      order_type_name: '',
      text_color: '#000000',
      text_bg: '#ffffff',
      remarks: '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const url = editOrderStatusType
      ? `${Api}/master/update_OrderStatusType/${editOrderStatusType.id}/`
      : `${Api}/master/create_OrderStatusType/`;
    const method = editOrderStatusType ? 'put' : 'post';

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
      fetchOrderStatusTypes();
    } catch (err) {
      console.error('Failed to save orderStatusType:', err);
    }
  };

  const toggleOrderStatusTypeStatus = async (id, action) => {
    try {
      await axios.delete(`${Api}/master/${action}_OrderStatusType/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchOrderStatusTypes();
    } catch (err) {
      console.error(`Failed to ${action} orderStatusType:`, err);
    }
  };

  return (
    <div className="d-flex flex-column" style={{ height: '100vh' }}>
      <TopNavbar />
      <div className="d-flex flex-grow-1">
        <AdminSidebar />
        <div className="p-4 flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
          <Row className="mb-3 align-items-center">
            <Col><h3>OrderStatusTypes</h3></Col>
            <Col className="text-end">
              <Button onClick={() => handleShowModal()} variant="primary">+ Add OrderStatusType</Button>
            </Col>
          </Row>

          <ToggleButtonGroup type="radio" name="filter" value={filter} onChange={setFilter} className="mb-3">
            <ToggleButton id="all" value="all" variant="outline-secondary">All</ToggleButton>
            <ToggleButton id="active" value="active" variant="outline-success">Active</ToggleButton>
            <ToggleButton id="inactive" value="inactive" variant="outline-danger">Inactive</ToggleButton>
          </ToggleButtonGroup>

          <Table bordered hover responsive className="bg-white shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Text Color</th>
                <th>Background</th>
                <th>Remarks</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrderStatusTypes.map((p) => (
                <tr key={p.id}>
                  <td>{p.order_type_name}</td>
                  <td><span style={{ color: p.text_color }}>{p.text_color}</span></td>
                  <td><span style={{ backgroundColor: p.text_bg, padding: '2px 6px' }}>{p.text_bg}</span></td>
                  <td>{p.remarks}</td>
                  <td>{p.is_active ? 'Active' : 'Inactive'}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => handleShowModal(p)}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant={p.is_active ? 'danger' : 'success'}
                      onClick={() => toggleOrderStatusTypeStatus(p.id, p.is_active ? 'disable' : 'enable')}
                    >
                      {p.is_active ? 'Disable' : 'Enable'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>{editOrderStatusType ? 'Edit' : 'Add'} OrderStatusType</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                {editOrderStatusType ? 'Update' : 'Create'}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default OrderStatusTypePage;
