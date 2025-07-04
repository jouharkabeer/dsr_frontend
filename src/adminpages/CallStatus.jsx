// import React, { useEffect, useState } from 'react';
// import {
//   Button, Table, Modal, Form, ToggleButtonGroup, ToggleButton, Row, Col,
// } from 'react-bootstrap';
// import axios from 'axios';
// import AdminSidebar from './adminsidebar';
// import TopNavbar from '../components/TopNavbar';
// import { Api } from '../api';
// function CallStatusPage() {
//   const [callStatuss, setCallStatuss] = useState([]);
//   const [filter, setFilter] = useState('all');
//   const [showModal, setShowModal] = useState(false);
//   const [editCallStatus, setEditCallStatus] = useState(null);
//   const [form, setForm] = useState({ call_status_name: '', remarks: '' });

//   const fetchCallStatuss = async () => {
//     try {
//       const res = await axios.get(`${Api}/master/view_allCallStatuss/`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       setCallStatuss(res.data);
//     } catch (err) {
//       console.error('Failed to fetch callStatuss:', err);
//     }
//   };

//   useEffect(() => {
//     fetchCallStatuss();
//   }, []);

//   const filteredCallStatuss = callStatuss.filter((mat) => {
//     if (filter === 'active') return mat.is_active;
//     if (filter === 'inactive') return !mat.is_active;
//     return true;
//   });

//   const handleShowModal = (callStatus = null) => {
//     setEditCallStatus(callStatus);
//     setForm(callStatus ? {
//       call_status_name: callStatus.call_status_name,
//       remarks: callStatus.remarks || '',
//     } : { call_status_name: '', remarks: '' });
//     setShowModal(true);
//   };

//   const handleSave = async () => {
//     const url = editCallStatus
//       ? `${Api}/master/update_CallStatus/${editCallStatus.id}/`
//       : `${Api}/master/create_CallStatus/`;
//     const method = editCallStatus ? 'put' : 'post';
//     try {
//       await axios({
//         method,
//         url,
//         data: {
//           call_status_name: form.call_status_name,
//           remarks: form.remarks,
//           is_active : true
//         },
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       setShowModal(false);
//       fetchCallStatuss();
//     } catch (err) {
//       console.error('Failed to save callStatus:', err);
//     }
//   };

//   const toggleCallStatusStatus = async (id, action) => {
//     try {
//       await axios.delete(`${Api}/master/${action}_CallStatus/${id}/`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       fetchCallStatuss();
//     } catch (err) {
//       console.error(`Failed to ${action} callStatus:`, err);
//     }
//   };

// return (
//   <div className="d-flex flex-column" style={{ height: '100vh' }}>
//     <TopNavbar />
//     <div className="d-flex flex-grow-1">
//       <AdminSidebar />
//       <div className="p-4 flex-grow-1 overflow-auto" style={{ maxHeight: '100%', backgroundColor: '#f8f9fa' }}>
//         <Row className="mb-3 align-items-center">
//           <Col><h3>CallStatuss</h3></Col>
//           <Col className="text-end">
//             <Button onClick={() => handleShowModal()} variant="primary">+ Add CallStatus</Button>
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
//             {filteredCallStatuss.map((mat) => (
//               <tr key={mat.id}>
//                 <td>{mat.call_status_name}</td>
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
//                     onClick={() => toggleCallStatusStatus(mat.id, mat.is_active ? 'disable' : 'enable')}
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
//             <Modal.Title>{editCallStatus ? 'Edit' : 'Add'} CallStatus</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Form>
//               <Form.Group className="mb-3">
//                 <Form.Label>CallStatus Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={form.call_status_name}
//                   onChange={(e) => setForm({ ...form, call_status_name: e.target.value })}
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
//               {editCallStatus ? 'Update' : 'Create'}
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       </div>
//     </div>
//   </div>
// );


// }

// export default CallStatusPage;



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

function CallStatusPage() {
  const [callStatuses, setCallStatuses] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editCallStatus, setEditCallStatus] = useState(null);
  const [form, setForm] = useState({ call_status_name: '', remarks: '' });
  const [error, setError] = useState('');

  const fetchCallStatuses = async () => {
    try {
      const res = await axios.get(`${Api}/master/view_allCallStatuss/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setCallStatuses(res.data);
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

  const toggleCallStatus = async (id, action) => {
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
    { field: 'call_status_name', headerName: 'Name', flex: 1 },
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
            onClick={() => toggleCallStatus(params.row.id, params.row.is_active ? 'disable' : 'enable')}
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
        </div>
      </div>
    </div>
  );
}

export default CallStatusPage;
