// import React, { useEffect, useState } from 'react';
// import {
//   Button, Table, Modal, Form, ToggleButtonGroup, ToggleButton, Row, Col,
// } from 'react-bootstrap';
// import axios from 'axios';
// import AdminSidebar from './adminsidebar';
// import TopNavbar from '../components/TopNavbar';
// import { Api } from '../api';
// function PaymentMethodPage() {
//   const [paymentMethods, setPaymentMethods] = useState([]);
//   const [filter, setFilter] = useState('all');
//   const [showModal, setShowModal] = useState(false);
//   const [editPaymentMethod, setEditPaymentMethod] = useState(null);
//   const [form, setForm] = useState({ payment_type_name: '', remarks: '' });

//   const fetchPaymentMethods = async () => {
//     try {
//       const res = await axios.get(`${Api}/master/view_allPaymentMethods/`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       setPaymentMethods(res.data);
//     } catch (err) {
//       console.error('Failed to fetch paymentMethods:', err);
//     }
//   };

//   useEffect(() => {
//     fetchPaymentMethods();
//   }, []);

//   const filteredPaymentMethods = paymentMethods.filter((mat) => {
//     if (filter === 'active') return mat.is_active;
//     if (filter === 'inactive') return !mat.is_active;
//     return true;
//   });

//   const handleShowModal = (paymentMethod = null) => {
//     setEditPaymentMethod(paymentMethod);
//     setForm(paymentMethod ? {
//       payment_type_name: paymentMethod.payment_type_name,
//       remarks: paymentMethod.remarks || '',
//     } : { payment_type_name: '', remarks: '' });
//     setShowModal(true);
//   };

//   const handleSave = async () => {
//     const url = editPaymentMethod
//       ? `${Api}/master/update_PaymentMethod/${editPaymentMethod.id}/`
//       : `${Api}/master/create_PaymentMethod/`;
//     const method = editPaymentMethod ? 'put' : 'post';
//     try {
//       await axios({
//         method,
//         url,
//         data: {
//           payment_type_name: form.payment_type_name,
//           remarks: form.remarks,
//           is_active : true
//         },
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       setShowModal(false);
//       fetchPaymentMethods();
//     } catch (err) {
//       console.error('Failed to save paymentMethod:', err);
//     }
//   };

//   const togglePaymentMethodStatus = async (id, action) => {
//     try {
//       await axios.delete(`${Api}/master/${action}_PaymentMethod/${id}/`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       fetchPaymentMethods();
//     } catch (err) {
//       console.error(`Failed to ${action} paymentMethod:`, err);
//     }
//   };

// return (
//   <div className="d-flex flex-column" style={{ height: '100vh' }}>
//     <TopNavbar />
//     <div className="d-flex flex-grow-1">
//       <AdminSidebar />
//       <div className="p-4 flex-grow-1 overflow-auto" style={{ maxHeight: '100%', backgroundColor: '#f8f9fa' }}>
//         <Row className="mb-3 align-items-center">
//           <Col><h3>PaymentMethods</h3></Col>
//           <Col className="text-end">
//             <Button onClick={() => handleShowModal()} variant="primary">+ Add PaymentMethod</Button>
//           </Col>
//         </Row>

//         <ToggleButtonGroup type="radio" name="filter" value={filter} onChange={setFilter} className="mb-3">
//           <ToggleButton id="all" value="all" variant="outline-secondary">All</ToggleButton>
//           <ToggleButton id="active" value="active" variant="outline-success">Active</ToggleButton>
//           <ToggleButton id="inactive" value="inactive" variant="outline-danger">Inactive</ToggleButton>
//         </ToggleButtonGroup>

//         <Table bordered hover responsive className="bg-white shadow-sm">
//           <thead className="table-dark">
//             <tr>
//               <th>Name</th>
//               <th>Remarks</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredPaymentMethods.map((mat) => (
//               <tr key={mat.id}>
//                 <td>{mat.payment_type_name}</td>
//                 <td>{mat.remarks}</td>
//                 <td>{mat.is_active ? 'Active' : 'Inactive'}</td>
//                 <td>
//                   <Button
//                     size="sm"
//                     variant="warning"
//                     onClick={() => handleShowModal(mat)}
//                     className="me-2"
//                   >
//                     Edit
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant={mat.is_active ? 'danger' : 'success'}
//                     onClick={() => togglePaymentMethodStatus(mat.id, mat.is_active ? 'disable' : 'enable')}
//                   >
//                     {mat.is_active ? 'Disable' : 'Enable'}
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//                 <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//           <Modal.Header closeButton>
//             <Modal.Title>{editPaymentMethod ? 'Edit' : 'Add'} PaymentMethod</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Form>
//               <Form.Group className="mb-3">
//                 <Form.Label>PaymentMethod Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={form.payment_type_name}
//                   onChange={(e) => setForm({ ...form, payment_type_name: e.target.value })}
//                   required
//                 />
//               </Form.Group>
//               <Form.Group>
//                 <Form.Label>Remarks</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={3}
//                   value={form.remarks}
//                   onChange={(e) => setForm({ ...form, remarks: e.target.value })}
//                 />
//               </Form.Group>
//             </Form>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
//             <Button variant="primary" onClick={handleSave}>
//               {editPaymentMethod ? 'Update' : 'Create'}
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       </div>
//     </div>
//   </div>
// );


// }

// export default PaymentMethodPage;


import React, { useEffect, useState } from 'react';
import {
  Button, Modal, Form, Row, Col, Alert, ToggleButtonGroup, ToggleButton,
} from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from './adminsidebar';
import TopNavbar from '../components/TopNavbar';
import { Api } from '../api';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

function PaymentMethodPage() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editPaymentMethod, setEditPaymentMethod] = useState(null);
  const [form, setForm] = useState({ payment_type_name: '', remarks: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const fetchPaymentMethods = async () => {
    try {
      const res = await axios.get(`${Api}/master/view_allPaymentMethods/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setPaymentMethods(res.data);
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
    .filter((mat) =>
      mat.payment_type_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
    { field: 'payment_type_name', headerName: 'Name', width : 150 },
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
            onClick={() =>
              togglePaymentMethodStatus(params.row.id, params.row.is_active ? 'disable' : 'enable')
            }
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

          <Form.Control
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
            style={{ maxWidth: '300px' }}
          />

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
                pagination: { paginationModel: { pageSize: 10 } }
              }}
              pageSizeOptions={[5, 10, 25]}
              checkboxSelection
              disableRowSelectionOnClick
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 300 },
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
        </div>
      </div>
    </div>
  );
}

export default PaymentMethodPage;
