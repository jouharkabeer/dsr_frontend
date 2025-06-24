import React, { useEffect, useState } from 'react';
import {
  Button, Table, Modal, Form, ToggleButtonGroup, ToggleButton, Row, Col,
} from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from './adminsidebar';
import TopNavbar from '../components/TopNavbar';

function MaterialPage() {
  const [materials, setMaterials] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editMaterial, setEditMaterial] = useState(null);
  const [form, setForm] = useState({ material_name: '', remarks: '' });

  const fetchMaterials = async () => {
    try {
      const res = await axios.get('https://dsr-backend-rimy.onrender.com/master/view_allMaterials/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setMaterials(res.data);
    } catch (err) {
      console.error('Failed to fetch materials:', err);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const filteredMaterials = materials.filter((mat) => {
    if (filter === 'active') return mat.is_active;
    if (filter === 'inactive') return !mat.is_active;
    return true;
  });

  const handleShowModal = (material = null) => {
    setEditMaterial(material);
    setForm(material ? {
      material_name: material.material_name,
      remarks: material.remarks || '',
    } : { material_name: '', remarks: '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    const url = editMaterial
      ? `https://dsr-backend-rimy.onrender.com/master/update_Material/${editMaterial.id}/`
      : 'https://dsr-backend-rimy.onrender.com/master/create_Material/';
    const method = editMaterial ? 'put' : 'post';
    try {
      await axios({
        method,
        url,
        data: {
          material_name: form.material_name,
          remarks: form.remarks,
          is_active : true
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setShowModal(false);
      fetchMaterials();
    } catch (err) {
      console.error('Failed to save material:', err);
    }
  };

  const toggleMaterialStatus = async (id, action) => {
    try {
      await axios.delete(`https://dsr-backend-rimy.onrender.com/master/${action}_Material/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchMaterials();
    } catch (err) {
      console.error(`Failed to ${action} material:`, err);
    }
  };

//   return (
//     <div className="d-flex">
//       <AdminSidebar />
//       <div className="p-4 flex-grow-1">
//         <Row className="mb-3 align-items-center">
//           <Col><h3>Materials</h3></Col>
//           <Col className="text-end">
//             <Button onClick={() => handleShowModal()} variant="primary">+ Add Material</Button>
//           </Col>
//         </Row>

//         <ToggleButtonGroup type="radio" name="filter" value={filter} onChange={setFilter} className="mb-3">
//           <ToggleButton id="all" value="all" variant="outline-secondary">All</ToggleButton>
//           <ToggleButton id="active" value="active" variant="outline-success">Active</ToggleButton>
//           <ToggleButton id="inactive" value="inactive" variant="outline-danger">Inactive</ToggleButton>
//         </ToggleButtonGroup>

//         <Table bordered hover responsive>
//           <thead className="table-dark">
//             <tr>
//               <th>Name</th>
//               <th>Remarks</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredMaterials.map((mat) => (
//               <tr key={mat.id}>
//                 <td>{mat.material_name}</td>
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
//                     onClick={() => toggleMaterialStatus(mat.id, mat.is_active ? 'disable' : 'enable')}
//                   >
//                     {mat.is_active ? 'Disable' : 'Enable'}
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>

//         {/* Add/Edit Modal */}
//         <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//           <Modal.Header closeButton>
//             <Modal.Title>{editMaterial ? 'Edit' : 'Add'} Material</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Form>
//               <Form.Group className="mb-3">
//                 <Form.Label>Material Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={form.material_name}
//                   onChange={(e) => setForm({ ...form, material_name: e.target.value })}
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
//               {editMaterial ? 'Update' : 'Create'}
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       </div>
//     </div>
//   );


return (
  <div className="d-flex flex-column" style={{ height: '100vh' }}>
    <TopNavbar />
    <div className="d-flex flex-grow-1">
      <AdminSidebar />
      <div className="p-4 flex-grow-1 overflow-auto" style={{ maxHeight: '100%', backgroundColor: '#f8f9fa' }}>
        <Row className="mb-3 align-items-center">
          <Col><h3>Materials</h3></Col>
          <Col className="text-end">
            <Button onClick={() => handleShowModal()} variant="primary">+ Add Material</Button>
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
              <th>Remarks</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaterials.map((mat) => (
              <tr key={mat.id}>
                <td>{mat.material_name}</td>
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
                    onClick={() => toggleMaterialStatus(mat.id, mat.is_active ? 'disable' : 'enable')}
                  >
                    {mat.is_active ? 'Disable' : 'Enable'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  </div>
);


}

export default MaterialPage;



// import React, { useEffect, useState } from 'react';
// import {
//   Modal, Form, Button, Row, Col,
// } from 'react-bootstrap';
// import axios from 'axios';
// import AdminSidebar from './adminsidebar';
// import TopNavbar from '../components/TopNavbar';
// import {
//   Box, IconButton, Tooltip,
// } from '@mui/material';
// import {
//   Edit as EditIcon,
//   Done,
//   DeleteOutline,
//   Add as AddIcon,
// } from '@mui/icons-material';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import Skeleton from '@mui/material/Skeleton';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useSidebar } from "../context/SidebarContext";

// function MaterialPage() {
//   const { sidebarOpen } = useSidebar();
//   const [materials, setMaterials] = useState([]);
//   const [filter, setFilter] = useState('all');
//   const [showModal, setShowModal] = useState(false);
//   const [editMaterial, setEditMaterial] = useState(null);
//   const [form, setForm] = useState({ material_name: '', remarks: '' });
//   const [loading, setLoading] = useState(true);

//   const fetchMaterials = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get('https://dsr-backend-rimy.onrender.com/master/view_allMaterials/', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       setMaterials(res.data);
//     } catch (err) {
//       console.error('Failed to fetch materials:', err);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchMaterials();
//   }, []);

//   const filteredMaterials = materials.filter((mat) => {
//     if (filter === 'active') return mat.is_active;
//     if (filter === 'inactive') return !mat.is_active;
//     return true;
//   });

//   const handleShowModal = (material = null) => {
//     setEditMaterial(material);
//     setForm(material ? {
//       material_name: material.material_name,
//       remarks: material.remarks || '',
//     } : { material_name: '', remarks: '' });
//     setShowModal(true);
//   };

//   const handleSave = async () => {
//     const url = editMaterial
//       ? `https://dsr-backend-rimy.onrender.com/master/update_Material/${editMaterial.id}/`
//       : 'https://dsr-backend-rimy.onrender.com/master/create_Material/';
//     const method = editMaterial ? 'put' : 'post';
//     try {
//       await axios({
//         method,
//         url,
//         data: {
//           material_name: form.material_name,
//           remarks: form.remarks,
//         },
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       setShowModal(false);
//       fetchMaterials();
//       toast.success(`Material ${editMaterial ? 'updated' : 'created'} successfully!`);
//     } catch (err) {
//       toast.error('Failed to save material.');
//       console.error('Failed to save material:', err);
//     }
//   };

//   const toggleMaterialStatus = async (id, action) => {
//     try {
//       await axios.get(`https://dsr-backend-rimy.onrender.com/master/${action}_Material/${id}/`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       fetchMaterials();
//       toast.success(`Material ${action === 'enable' ? 'enabled' : 'disabled'} successfully!`);
//     } catch (err) {
//       toast.error(`Failed to ${action} material.`);
//       console.error(`Failed to ${action} material:`, err);
//     }
//   };

//   return (
//     <div className="d-flex flex-column" style={{ height: '100vh' }}>
//       <TopNavbar />
//       <div className="d-flex flex-grow-1 main" style={{ marginTop: '60px' }}>
//         <AdminSidebar />
//         {/* <div className="right flex-grow-1 p-4"> */}
//         <div
//         style={{
//           flex: 1,
//           padding: "1rem",
//           marginLeft: sidebarOpen ? "250px" : "80px", // Match your collapsed width
//           transition: "margin 0.3s ease",
//         }}>
//           <ToastContainer />

//           {/* Header */}
//           <div className="head_section d-flex justify-content-between align-items-center mb-4 p-3 bg-white rounded shadow-sm">
//             <h4 style={{ fontWeight: 'bold' }}>Materials</h4>
//             <div className="d-flex gap-2">
//               <button
//                 className={filter === 'all' ? 'btnstyle' : 'btnstyle-inactive'}
//                 onClick={() => setFilter('all')}
//               >
//                 All <span className="count">{materials.length}</span>
//               </button>
//               <button
//                 className={filter === 'active' ? 'btnstyle' : 'btnstyle-inactive'}
//                 onClick={() => setFilter('active')}
//               >
//                 Active <span className="count">{materials.filter(m => m.is_active).length}</span>
//               </button>
//               <button
//                 className={filter === 'inactive' ? 'btnstyle' : 'btnstyle-inactive'}
//                 onClick={() => setFilter('inactive')}
//               >
//                 Inactive <span className="count">{materials.filter(m => !m.is_active).length}</span>
//               </button>
//               <Tooltip title="Add Material">
//                 <IconButton
//                   onClick={() => handleShowModal()}
//                   className="btnadd"
//                   style={{ backgroundColor: 'green', color: 'white' }}
//                 >
//                   <AddIcon />
//                 </IconButton>
//               </Tooltip>
//             </div>
//           </div>

//           {/* Table */}
//           <Box className="bg-white shadow-sm rounded" sx={{ height: 500 }}>
//             {loading ? (
//               <div className="p-3">
//                 {[...Array(5)].map((_, index) => (
//                   <Skeleton
//                     key={index}
//                     variant="rectangular"
//                     width="100%"
//                     height={50}
//                     sx={{ borderRadius: 1, mb: 1 }}
//                   />
//                 ))}
//               </div>
//             ) : (
//               <DataGrid
//                 rows={filteredMaterials}
//                 columns={[
//                   { field: 'material_name', headerName: 'Name', flex: 1 },
//                   { field: 'remarks', headerName: 'Remarks', flex: 2 },
//                   {
//                     field: 'status',
//                     headerName: 'Status',
//                     flex: 1,
//                     renderCell: (params) => (
//                       params.row.is_active ? 'Active' : 'Inactive'
//                     ),
//                   },
//                   {
//                     field: 'actions',
//                     headerName: 'Actions',
//                     flex: 1,
//                     sortable: false,
//                     renderCell: (params) => (
//                       <>
//                         <Tooltip title="Edit">
//                           <IconButton
//                             onClick={() => handleShowModal(params.row)}
//                             color="primary"
//                           >
//                             <EditIcon />
//                           </IconButton>
//                         </Tooltip>
//                         <Tooltip title={params.row.is_active ? 'Disable' : 'Enable'}>
//                           <IconButton
//                             onClick={() =>
//                               toggleMaterialStatus(params.row.id, params.row.is_active ? 'disable' : 'enable')
//                             }
//                             color={params.row.is_active ? 'error' : 'success'}
//                           >
//                             {params.row.is_active ? <DeleteOutline /> : <Done />}
//                           </IconButton>
//                         </Tooltip>
//                       </>
//                     ),
//                   },
//                 ]}
//                 getRowId={(row) => row.id}
//                 disableRowSelectionOnClick
//                 disableColumnMenu
//                 pageSizeOptions={[5, 10, 20]}
//                 slots={{ toolbar: GridToolbar }}
//                 slotProps={{
//                   toolbar: {
//                     showQuickFilter: true,
//                   },
//                 }}
//               />
//             )}
//           </Box>

//           {/* Modal */}
//           <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//             <Modal.Header closeButton>
//               <Modal.Title>{editMaterial ? 'Edit' : 'Add'} Material</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               <Form>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Material Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={form.material_name}
//                     onChange={(e) => setForm({ ...form, material_name: e.target.value })}
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
//                 {editMaterial ? 'Update' : 'Create'}
//               </Button>
//             </Modal.Footer>
//           </Modal>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MaterialPage;
