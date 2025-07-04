// import React, { useEffect, useState } from 'react';
// import {
//   Button, Table, Modal, Form, ToggleButtonGroup, ToggleButton, Row, Col, Alert,
// } from 'react-bootstrap';
// import axios from 'axios';
// import AdminSidebar from './adminsidebar';
// import TopNavbar from '../components/TopNavbar';
// import { Api } from '../api';

// function BranchPage() {
//   const [branchs, setBranchs] = useState([]);
//   const [filter, setFilter] = useState('all');
//   const [showModal, setShowModal] = useState(false);
//   const [editBranch, setEditBranch] = useState(null);
//   const [form, setForm] = useState({ branch_name: '', remarks: '' });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [error, setError] = useState('');

//   const fetchBranchs = async () => {
//     try {
//       const res = await axios.get(`${Api}/master/view_allBranchs/`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       setBranchs(res.data);
//     } catch (err) {
//       console.error('Failed to fetch branches:', err);
//     }
//   };

//   useEffect(() => {
//     fetchBranchs();
//   }, []);

//   const filteredBranchs = branchs
//     .filter((mat) => {
//       if (filter === 'active') return mat.is_active;
//       if (filter === 'inactive') return !mat.is_active;
//       return true;
//     })
//     .filter((mat) =>
//       mat.branch_name?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//   const handleShowModal = (branch = null) => {
//     setEditBranch(branch);
//     setForm(branch ? {
//       branch_name: branch.branch_name,
//       remarks: branch.remarks || '',
//     } : { branch_name: '', remarks: '' });
//     setError('');
//     setShowModal(true);
//   };

//   const handleSave = async () => {
//     // Validation
//     const trimmed = form.branch_name.trim();
//     if (trimmed.length < 3 || /^\d+$/.test(trimmed)) {
//       setError('Branch name must be at least 3 characters and not all numbers.');
//       return;
//     }

//     const url = editBranch
//       ? `${Api}/master/update_Branch/${editBranch.id}/`
//       : `${Api}/master/create_Branch/`;
//     const method = editBranch ? 'put' : 'post';
//     try {
//       await axios({
//         method,
//         url,
//         data: {
//           branch_name: form.branch_name,
//           remarks: form.remarks,
//           is_active: true
//         },
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       setShowModal(false);
//       fetchBranchs();
//     } catch (err) {
//       console.error('Failed to save branch:', err);
//     }
//   };

//   const toggleBranchStatus = async (id, action) => {
//     try {
//       await axios.delete(`${Api}/master/${action}_Branch/${id}/`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       fetchBranchs();
//     } catch (err) {
//       console.error(`Failed to ${action} branch:`, err);
//     }
//   };

//   return (
//     <div className="d-flex flex-column" style={{ height: '100vh' }}>
//       <TopNavbar />
//       <div className="d-flex flex-grow-1">
//         <AdminSidebar />
//         <div className="p-4 flex-grow-1 overflow-auto" style={{ maxHeight: '100%', backgroundColor: '#f8f9fa' }}>
//           <Row className="mb-3 align-items-center">
//             <Col><h3>Branches</h3></Col>
//             <Col className="text-end">
//               <Button onClick={() => handleShowModal()} variant="primary">+ Add Branch</Button>
//             </Col>
//           </Row>

//           <Form.Control
//             type="text"
//             placeholder="Search by branch name"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="mb-3"
//             style={{ maxWidth: '300px' }}
//           />

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
//               {filteredBranchs.map((mat) => (
//                 <tr key={mat.id}>
//                   <td>{mat.branch_name}</td>
//                   <td>{mat.remarks}</td>
//                   <td>{mat.is_active ? 'Active' : 'Inactive'}</td>
//                   <td>
//                     <Button
//                       size="sm"
//                       variant="warning"
//                       onClick={() => handleShowModal(mat)}
//                       className="me-2"
//                     >
//                       Edit
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant={mat.is_active ? 'danger' : 'success'}
//                       onClick={() => toggleBranchStatus(mat.id, mat.is_active ? 'disable' : 'enable')}
//                     >
//                       {mat.is_active ? 'Disable' : 'Enable'}
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>

//           {/* Modal */}
//           <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//             <Modal.Header closeButton>
//               <Modal.Title>{editBranch ? 'Edit' : 'Add'} Branch</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               {error && <Alert variant="danger">{error}</Alert>}
//               <Form>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Branch Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={form.branch_name}
//                     onChange={(e) => setForm({ ...form, branch_name: e.target.value })}
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
//                 {editBranch ? 'Update' : 'Create'}
//               </Button>
//             </Modal.Footer>
//           </Modal>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default BranchPage;



import React, { useEffect, useState } from 'react';
import {
  Button, Modal, Form, Row, Col, Alert,
} from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from './adminsidebar';
import TopNavbar from '../components/TopNavbar';
import { Api } from '../api';
import { DataGrid } from '@mui/x-data-grid';

function BranchPage() {
  const [branches, setBranches] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editBranch, setEditBranch] = useState(null);
  const [form, setForm] = useState({ branch_name: '', remarks: '' });
  const [error, setError] = useState('');

  const fetchBranches = async () => {
    try {
      const res = await axios.get(`${Api}/master/view_allBranchs/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setBranches(res.data);
    } catch (err) {
      console.error('Failed to fetch branches:', err);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const filteredBranches = branches.filter((b) => {
    if (filter === 'active') return b.is_active;
    if (filter === 'inactive') return !b.is_active;
    return true;
  });

  const handleShowModal = (branch = null) => {
    setEditBranch(branch);
    setForm(branch ? {
      branch_name: branch.branch_name,
      remarks: branch.remarks || '',
    } : { branch_name: '', remarks: '' });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    const trimmed = form.branch_name.trim();
    if (trimmed.length < 3 || /^\d+$/.test(trimmed)) {
      setError('Branch name must be at least 3 characters and not all numbers.');
      return;
    }

    const url = editBranch
      ? `${Api}/master/update_Branch/${editBranch.id}/`
      : `${Api}/master/create_Branch/`;
    const method = editBranch ? 'put' : 'post';
    try {
      await axios({
        method,
        url,
        data: {
          branch_name: form.branch_name,
          remarks: form.remarks,
          is_active: true
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setShowModal(false);
      fetchBranches();
    } catch (err) {
      console.error('Failed to save branch:', err);
    }
  };

  const toggleBranchStatus = async (id, action) => {
    try {
      await axios.delete(`${Api}/master/${action}_Branch/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchBranches();
    } catch (err) {
      console.error(`Failed to ${action} branch:`, err);
    }
  };

  const columns = [
    { field: 'branch_name', headerName: 'Name', flex: 1 },
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
            onClick={() => toggleBranchStatus(params.row.id, params.row.is_active ? 'disable' : 'enable')}
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
            <Col><h3>Branches</h3></Col>
            <Col className="text-end">
              <Button onClick={() => handleShowModal()} variant="primary">+ Add Branch</Button>
            </Col>
          </Row>

          <Form.Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ maxWidth: '200px' }}
            className="mb-3"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Form.Select>

          <div style={{ height: 600, width: '100%' }} className="bg-white p-3 rounded shadow-sm">
            <DataGrid
              rows={filteredBranches}
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
              <Modal.Title>{editBranch ? 'Edit' : 'Add'} Branch</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Branch Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.branch_name}
                    onChange={(e) => setForm({ ...form, branch_name: e.target.value })}
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
                {editBranch ? 'Update' : 'Create'}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default BranchPage;