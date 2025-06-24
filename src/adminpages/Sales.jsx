import React, { useEffect, useState } from 'react';
import {
  Button, Table, Modal, Form, ToggleButtonGroup, ToggleButton, Row, Col,
} from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import AdminSidebar from './adminsidebar';
import TopNavbar from '../components/TopNavbar';
import { Api } from '../api';

function SalesPage() {
  const [sales, setSales] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editSales, setEditSales] = useState(null);
  const [form, setForm] = useState({
    material: [],
    customer: '',
    user: '',
    call_status: '',
    prospect: '',
    order_status: '',
    region: '',
    payment_method: '',
    expected_payment_amount: '',
    expected_payment_date: '',
    payment_recieved: '',
    final_due_date: '',
    quotation_provided: false,
    quotation_value: '',
    order_value: '',
    remarks: '',
  });

  const [options, setOptions] = useState({
    material: [],
    customer: [],
    user: [],
    call_status: [],
    prospect: [],
    order_status: [],
    region: [],
    payment_method: [],
  });

  const fetchOptions = async () => {
    const endpoints = {
      material: `${Api}/master/view_activeMaterial/`,
      customer: `${Api}/master/view_activeCustomer/`,
      user: `${Api}/user/view_activeUser/`,
      call_status: `${Api}/master/view_activeCallStatus/`,
      prospect: `${Api}/master/view_activeProspect/`,
      order_status: `${Api}/master/view_activeOrderStatusType/`,
      region: `${Api}/master/view_activeRegion/`,
      payment_method: `${Api}/master/view_activePaymentMethod/`,
    };

    const fetchAll = Object.entries(endpoints).map(async ([key, url]) => {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      return [key, res.data];
    });

    const results = await Promise.all(fetchAll);
    const newOptions = {};
    results.forEach(([key, data]) => {
      newOptions[key] = data;
    });
    setOptions(newOptions);
  };
console.log(options)
  const fetchSales = async () => {
    const url =
      filter === 'active'
        ? `${Api}/sales/view_activeSalesWeb/`
        : `${Api}/sales/view_allSalesWebs/`;

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    });
    setSales(res.data);
  };

  useEffect(() => {
    fetchSales();
    fetchOptions();
  }, [filter]);

  const handleShowModal = (salesItem = null) => {
    setEditSales(salesItem);
    setForm(salesItem
      ? {
          ...salesItem,
          material: salesItem.material.map((mat) => ({ value: mat.id, label: mat.material_name })),
        }
      : {
          material: [],
          customer: '',
          user: '',
          call_status: '',
          prospect: '',
          order_status: '',
          region: '',
          payment_method: '',
          expected_payment_amount: '',
          expected_payment_date: '',
          payment_recieved: '',
          final_due_date: '',
          quotation_provided: false,
          quotation_value: '',
          order_value: '',
          remarks: '',
        });
    setShowModal(true);
  };

  const handleSave = async () => {
    const url = editSales
      ? `${Api}/sales/update_SalesWeb/`
      : `${Api}/sales/create_SalesWeb/`;
    const method = editSales ? 'put' : 'post';

    const payload = {
      ...form,
      material: form.material.map((m) => m.value),
    };

    try {
      await axios({
        method,
        url,
        data: payload,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setShowModal(false);
      fetchSales();
    } catch (err) {
      console.error('Failed to save sales record:', err);
    }
  };

  const toggleSalesStatus = async (id, action) => {
    try {
      await axios.delete(`${Api}/sales/${action}_SalesWeb/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchSales();
    } catch (err) {
      console.error(`Failed to ${action} SalesWeb:`, err);
    }
  };

  return (
    <div className="d-flex flex-column" style={{ height: '100vh' }}>
      <TopNavbar />
      <div className="d-flex flex-grow-1">
        <AdminSidebar />
        <div className="p-4 flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
          <Row className="mb-3 align-items-center">
            <Col><h3>Sales</h3></Col>
            <Col className="text-end">
              <Button onClick={() => handleShowModal()} variant="primary">+ Add Sales</Button>
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
                <th>Customer</th>
                <th>Materials</th>
                <th>Call Status</th>
                <th>Prospect</th>
                <th>Order Value</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((item) => (
                <tr key={item.id}>
                  <td>{item.customer_name}</td>
                  <td>{item.material_name}</td>
                  <td>{item.call_status_name}</td>
                  <td>{item.prospect_name}</td>
                  <td>{item.order_value}</td>
                  <td>{item.is_active ? 'Active' : 'Inactive'}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => handleShowModal(item)}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant={item.is_active ? 'danger' : 'success'}
                      onClick={() => toggleSalesStatus(item.id, item.is_active ? 'disable' : 'enable')}
                    >
                      {item.is_active ? 'Disable' : 'Enable'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{editSales ? 'Edit Sales' : 'Add Sales'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Materials</Form.Label>
                  <Select
                    isMulti
                    options={options.material.map((mat) => ({ value: mat.id, label: mat.material_name }))}
                    value={form.material}
                    onChange={(selected) => setForm({ ...form, material: selected })}
                  />
                </Form.Group>
                {[
                  ['customer', 'Customer'],
                  ['user', 'User'],
                  ['call_status', 'Call Status'],
                  ['prospect', 'Prospect'],
                  ['order_status', 'Order Status'],
                  ['region', 'Region'],
                  ['payment_method', 'Payment Method'],
                ].map(([field, label]) => (
                  <Form.Group className="mb-2" key={field}>
                    <Form.Label>{label}</Form.Label>
                    <Form.Select
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    >
                      <option value="">Select {label}</option>
                      {options[field]?.map((item) => (
                        <option value={item.id} key={item.id}>{item[`${field}_name`] || item.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                ))}

                <Row className="mb-2">
                  <Col>
                    <Form.Label>Expected Payment Amount</Form.Label>
                    <Form.Control
                      type="number"
                      value={form.expected_payment_amount || ''}
                      onChange={(e) => setForm({ ...form, expected_payment_amount: e.target.value })}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Expected Payment Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={form.expected_payment_date || ''}
                      onChange={(e) => setForm({ ...form, expected_payment_date: e.target.value })}
                    />
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col>
                    <Form.Label>Payment Received</Form.Label>
                    <Form.Control
                      type="number"
                      value={form.payment_recieved || ''}
                      onChange={(e) => setForm({ ...form, payment_recieved: e.target.value })}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Final Due Days</Form.Label>
                    <Form.Control
                      type="number"
                      value={form.final_due_date || ''}
                      onChange={(e) => setForm({ ...form, final_due_date: e.target.value })}
                    />
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col>
                    <Form.Check
                      type="checkbox"
                      label="Quotation Provided"
                      checked={form.quotation_provided}
                      onChange={(e) => setForm({ ...form, quotation_provided: e.target.checked })}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Quotation Value</Form.Label>
                    <Form.Control
                      type="number"
                      value={form.quotation_value || ''}
                      onChange={(e) => setForm({ ...form, quotation_value: e.target.value })}
                    />
                  </Col>
                  <Col>
                    <Form.Label>Order Value</Form.Label>
                    <Form.Control
                      type="number"
                      value={form.order_value || ''}
                      onChange={(e) => setForm({ ...form, order_value: e.target.value })}
                    />
                  </Col>
                </Row>

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
                {editSales ? 'Update' : 'Create'}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default SalesPage;
