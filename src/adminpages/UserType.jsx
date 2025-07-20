// import React, { useEffect, useState } from 'react';
// import {
//   Button, Table, Modal, Form, ToggleButtonGroup, ToggleButton, Row, Col,
// } from 'react-bootstrap';
// import axios from 'axios';
// import AdminSidebar from './adminsidebar';
// import TopNavbar from '../components/TopNavbar';
// import { Api } from '../api';
// function UserTypePage() {
//   const [userTypes, setUserTypes] = useState([]);
//   const [filter, setFilter] = useState('all');
//   const [showModal, setShowModal] = useState(false);
//   const [editUserType, setEditUserType] = useState(null);
//   const [form, setForm] = useState({ userType_name: '', remarks: '' });

//   const fetchUserTypes = async () => {
//     try {
//       const res = await axios.get(`${Api}/user/view_allUserTypes/`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       setUserTypes(res.data);
//     } catch (err) {
//       console.error('Failed to fetch userTypes:', err);
//     }
//   };

//   useEffect(() => {
//     fetchUserTypes();
//   }, []);

//   const filteredUserTypes = userTypes.filter((mat) => {
//     if (filter === 'active') return mat.is_active;
//     if (filter === 'inactive') return !mat.is_active;
//     return true;
//   });

//   const handleShowModal = (userType = null) => {
//     setEditUserType(userType);
//     setForm(userType ? {
//       userType_name: userType.userType_name,
//       remarks: userType.remarks || '',
//     } : { userType_name: '', remarks: '' });
//     setShowModal(true);
//   };

//   const handleSave = async () => {
//     const url = editUserType
//       ? `${Api}/user/update_UserType/${editUserType.id}/`
//       : `${Api}/user/create_UserType/`;
//     const method = editUserType ? 'put' : 'post';
//     try {
//       await axios({
//         method,
//         url,
//         data: {
//           name: form.userType_name,
//           remarks: form.remarks,
//           is_active : true
//         },
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       setShowModal(false);
//       fetchUserTypes();
//     } catch (err) {
//       console.error('Failed to save userType:', err);
//     }
//   };

//   const toggleUserTypeStatus = async (id, action) => {
//     try {
//       await axios.delete(`${Api}/user/${action}_UserType/${id}/`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       fetchUserTypes();
//     } catch (err) {
//       console.error(`Failed to ${action} userType:`, err);
//     }
//   };

// return (
//   <div className="d-flex flex-column" style={{ height: '100vh' }}>
//     <TopNavbar />
//     <div className="d-flex flex-grow-1">
//       <AdminSidebar />
//       <div className="p-4 flex-grow-1 overflow-auto" style={{ maxHeight: '100%', backgroundColor: '#f8f9fa' }}>
//         <Row className="mb-3 align-items-center">
//           <Col><h3>UserTypes</h3></Col>
//           <Col className="text-end">
//             <Button onClick={() => handleShowModal()} variant="primary">+ Add UserType</Button>
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
//             {filteredUserTypes.map((mat) => (
//               <tr key={mat.id}>
//                 <td>{mat.name}</td>
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
//                     onClick={() => toggleUserTypeStatus(mat.id, mat.is_active ? 'disable' : 'enable')}
//                   >
//                     {mat.is_active ? 'Disable' : 'Enable'}
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//                 <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//                   <Modal.Header closeButton>
//                     <Modal.Title>{editUserType ? 'Edit' : 'Add'} UserType</Modal.Title>
//                   </Modal.Header>
//                   <Modal.Body>
//                     <Form>
//                       <Form.Group className="mb-3">
//                         <Form.Label>UserType Name</Form.Label>
//                         <Form.Control
//                           type="text"
//                           value={form.userType_name}
//                           onChange={(e) => setForm({ ...form, userType_name: e.target.value })}
//                           required
//                         />
//                       </Form.Group>
//                       <Form.Group>
//                         <Form.Label>Remarks</Form.Label>
//                         <Form.Control
//                           as="textarea"
//                           rows={3}
//                           value={form.remarks}
//                           onChange={(e) => setForm({ ...form, remarks: e.target.value })}
//                         />
//                       </Form.Group>
//                     </Form>
//                   </Modal.Body>
//                   <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
//                     <Button variant="primary" onClick={handleSave}>
//                       {editUserType ? 'Update' : 'Create'}
//                     </Button>
//                   </Modal.Footer>
//                 </Modal>
//       </div>
//     </div>
//   </div>
// );


// }

// export default UserTypePage;


// import React, { useEffect, useState } from 'react';
// import {
//   Button, Table, Modal, Form, ToggleButtonGroup, ToggleButton, Row, Col,
// } from 'react-bootstrap';
// import axios from 'axios';
// import AdminSidebar from './adminsidebar';
// import TopNavbar from '../components/TopNavbar';
// import { Api } from '../api';

// function UserTypePage() {
//   const [userTypes, setUserTypes] = useState([]);
//   const [filter, setFilter] = useState('all');
//   const [showModal, setShowModal] = useState(false);
//   const [editUserType, setEditUserType] = useState(null);
//   const [form, setForm] = useState({ userType_name: '', remarks: '' });

//   const fetchUserTypes = async () => {
//     try {
//       const res = await axios.get(`${Api}/user/view_allUserTypes/`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       setUserTypes(res.data);
//     } catch (err) {
//       console.error('Failed to fetch user types:', err);
//     }
//   };

//   useEffect(() => {
//     fetchUserTypes();
//   }, []);

//   const filteredUserTypes = userTypes.filter((ut) => {
//     if (filter === 'active') return ut.is_active;
//     if (filter === 'inactive') return !ut.is_active;
//     return true;
//   });

//   const handleShowModal = (userType = null) => {
//     setEditUserType(userType);
//     setForm(userType ? {
//       userType_name: userType.name,
//       remarks: userType.remarks || '',
//     } : { userType_name: '', remarks: '' });
//     setShowModal(true);
//   };

//   const handleSave = async () => {
//     const url = editUserType
//       ? `${Api}/user/update_UserType/${editUserType.id}/`
//       : `${Api}/user/create_UserType/`;
//     const method = editUserType ? 'put' : 'post';

//     try {
//       await axios({
//         method,
//         url,
//         data: {
//           name: form.userType_name,
//           remarks: form.remarks,
//           is_active: true,
//         },
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       setShowModal(false);
//       fetchUserTypes();
//     } catch (err) {
//       console.error('Failed to save user type:', err);
//     }
//   };

//   const toggleUserTypeStatus = async (id, action) => {
//     try {
//       await axios.delete(`${Api}/user/${action}_UserType/${id}/`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       fetchUserTypes();
//     } catch (err) {
//       console.error(`Failed to ${action} user type:`, err);
//     }
//   };

//   return (
//     <div className="d-flex flex-column" style={{ height: '100vh' }}>
//       <TopNavbar />
//       <div className="d-flex flex-grow-1">
//         <AdminSidebar />
//         <div className="p-4 flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
//           <Row className="mb-3 align-items-center">
//             <Col><h3>User Types</h3></Col>
//             <Col className="text-end">
//               <Button onClick={() => handleShowModal()} variant="primary">+ Add User Type</Button>
//             </Col>
//           </Row>

//           <ToggleButtonGroup type="radio" name="filter" value={filter} onChange={setFilter} className="mb-3">
//             <ToggleButton id="all" value="all" variant="outline-secondary">All</ToggleButton>
//             <ToggleButton id="active" value="active" variant="outline-success">Active</ToggleButton>
//             <ToggleButton id="inactive" value="inactive" variant="outline-danger">Inactive</ToggleButton>
//           </ToggleButtonGroup>

//           <Table bordered hover responsive className="bg-white shadow-sm">
//             <thead className="table-dark">
//               <tr>
//                 <th>Name</th>
//                 <th>Remarks</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUserTypes.map((ut) => (
//                 <tr key={ut.id}>
//                   <td>{ut.name}</td>
//                   <td>{ut.remarks}</td>
//                   <td>{ut.is_active ? 'Active' : 'Inactive'}</td>
//                   <td>
//                     <Button
//                       size="sm"
//                       variant="warning"
//                       onClick={() => handleShowModal(ut)}
//                       className="me-2"
//                     >
//                       Edit
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant={ut.is_active ? 'danger' : 'success'}
//                       onClick={() => toggleUserTypeStatus(ut.id, ut.is_active ? 'disable' : 'enable')}
//                     >
//                       {ut.is_active ? 'Disable' : 'Enable'}
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>

//           <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//             <Modal.Header closeButton>
//               <Modal.Title>{editUserType ? 'Edit' : 'Add'} User Type</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               <Form>
//                 <Form.Group className="mb-3">
//                   <Form.Label>User Type Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={form.userType_name}
//                     onChange={(e) => setForm({ ...form, userType_name: e.target.value })}
//                     required
//                   />
//                 </Form.Group>
//                 <Form.Group>
//                   <Form.Label>Remarks</Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={3}
//                     value={form.remarks}
//                     onChange={(e) => setForm({ ...form, remarks: e.target.value })}
//                   />
//                 </Form.Group>
//               </Form>
//             </Modal.Body>
//             <Modal.Footer>
//               <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
//               <Button variant="primary" onClick={handleSave}>
//                 {editUserType ? 'Update' : 'Create'}
//               </Button>
//             </Modal.Footer>
//           </Modal>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default UserTypePage;


import React, { useEffect, useState } from 'react';
import {
  Button, Modal, Form, Row, Col, Alert, ToggleButtonGroup, ToggleButton
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


function UserTypePage() {
  const [userTypes, setUserTypes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editUserType, setEditUserType] = useState(null);
  const [form, setForm] = useState({ userType_name: '', remarks: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true)


  const fetchUserTypes = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${Api}/user/view_allUserTypes/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setUserTypes(res.data);
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch user types:', err);
    }
  };

  useEffect(() => {
    fetchUserTypes();
  }, []);

  const filteredUserTypes = userTypes.filter((ut) => {
    if (filter === 'active') return ut.is_active;
    if (filter === 'inactive') return !ut.is_active;
    return true;
  });

  const handleShowModal = (userType = null) => {
    setEditUserType(userType);
    setForm(userType ? {
      userType_name: userType.name,
      remarks: userType.remarks || '',
    } : { userType_name: '', remarks: '' });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    const trimmed = form.userType_name.trim();
    if (trimmed.length < 3 || /^\d+$/.test(trimmed)) {
      setError('User Type name must be at least 3 characters and not all numbers.');
      return;
    }

    const url = editUserType
      ? `${Api}/user/update_UserType/${editUserType.id}/`
      : `${Api}/user/create_UserType/`;
    const method = editUserType ? 'put' : 'post';

    try {
      await axios({
        method,
        url,
        data: {
          name: form.userType_name,
          remarks: form.remarks,
          is_active: true,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setShowModal(false);
      fetchUserTypes();
    } catch (err) {
      console.error('Failed to save user type:', err);
    }
  };

  const toggleStatus = async (id, action) => {
    try {
      await axios.delete(`${Api}/user/${action}_UserType/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchUserTypes();
    } catch (err) {
      console.error(`Failed to ${action} user type:`, err);
    }
  };

  const columns = [
    { field: 'name', headerName: 'User Type', flex : 1, },
    { field: 'remarks', headerName: 'Remarks', flex : 1, },
    {
      field: 'is_active',
      headerName: 'Status',
      flex : 1,
      renderCell: (params) => (params.value ? 'Active' : 'Inactive'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex : 1,
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
            <Col><h3>User Types</h3></Col>
            <Col className="text-end">
              <Button onClick={() => handleShowModal()} variant="primary">+ Add</Button>
            </Col>
          </Row>

          <ToggleButtonGroup type="radio" name="filter" value={filter} onChange={setFilter} className="mb-3">
            <ToggleButton id="all" value="all" variant="outline-secondary">All</ToggleButton>
            <ToggleButton id="active" value="active" variant="outline-success">Active</ToggleButton>
            <ToggleButton id="inactive" value="inactive" variant="outline-danger">Inactive</ToggleButton>
          </ToggleButtonGroup>

          <div style={{ height: 500, width: '100%' }} className="bg-white p-3 rounded shadow-sm">
            <DataGrid
              rows={filteredUserTypes}
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
              <Modal.Title>{editUserType ? 'Edit' : 'Add'} User Type</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>User Type Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.userType_name}
                    onChange={(e) => setForm({ ...form, userType_name: e.target.value })}
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
                {editUserType ? 'Update' : 'Create'}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>}
      </div>
    </div>
  );
}

export default UserTypePage;
