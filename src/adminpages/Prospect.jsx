// import React, { useEffect, useState } from 'react';
// import {
//   Button, Table, Modal, Form, ToggleButtonGroup, ToggleButton, Row, Col
// } from 'react-bootstrap';
// import axios from 'axios';
// import AdminSidebar from './adminsidebar';
// import TopNavbar from '../components/TopNavbar';
// import { Api } from '../api';

// function ProspectPage() {
//   const [prospects, setProspects] = useState([]);
//   const [filter, setFilter] = useState('all');
//   const [showModal, setShowModal] = useState(false);
//   const [editProspect, setEditProspect] = useState(null);
//   const [form, setForm] = useState({
//     prospect_name: '',
//     text_color: '#000000',
//     text_bg: '#ffffff',
//     remarks: '',
//   });

//   const fetchProspects = async () => {
//     try {
//       const res = await axios.get(`${Api}/master/view_allProspects/`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       setProspects(res.data);
//     } catch (err) {
//       console.error('Failed to fetch prospects:', err);
//     }
//   };
// console.log(prospects)
//   useEffect(() => {
//     fetchProspects();
//   }, []);

//   const filteredProspects = prospects.filter((p) => {
//     if (filter === 'active') return p.is_active;
//     if (filter === 'inactive') return !p.is_active;
//     return true;
//   });

//   const handleShowModal = (prospect = null) => {
//     setEditProspect(prospect);
//     setForm(prospect ? {
//       prospect_name: prospect.prospect_name,
//       text_color: prospect.text_color || '#000000',
//       text_bg: prospect.text_bg || '#ffffff',
//       remarks: prospect.remarks || '',
//     } : {
//       prospect_name: '',
//       text_color: '#000000',
//       text_bg: '#ffffff',
//       remarks: '',
//     });
//     setShowModal(true);
//   };

//   const handleSave = async () => {
//     const url = editProspect
//       ? `${Api}/master/update_Prospect/${editProspect.id}/`
//       : `${Api}/master/create_Prospect/`;
//     const method = editProspect ? 'put' : 'post';

//     try {
//       await axios({
//         method,
//         url,
//         data: {
//           ...form,
//           is_active: true,
//         },
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       setShowModal(false);
//       fetchProspects();
//     } catch (err) {
//       console.error('Failed to save prospect:', err);
//     }
//   };

//   const toggleProspectStatus = async (id, action) => {
//     try {
//       await axios.delete(`${Api}/master/${action}_Prospect/${id}/`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       fetchProspects();
//     } catch (err) {
//       console.error(`Failed to ${action} prospect:`, err);
//     }
//   };

//   return (
//     <div className="d-flex flex-column" style={{ height: '100vh' }}>
//       <TopNavbar />
//       <div className="d-flex flex-grow-1">
//         <AdminSidebar />
//         <div className="p-4 flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
//           <Row className="mb-3 align-items-center">
//             <Col><h3>Prospects</h3></Col>
//             <Col className="text-end">
//               <Button onClick={() => handleShowModal()} variant="primary">+ Add Prospect</Button>
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
//                 <th>Text Color</th>
//                 <th>Background</th>
//                 <th>Remarks</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredProspects.map((p) => (
//                 <tr key={p.id}>
//                   <td>{p.prospect_name}</td>
//                   <td><span style={{ color: p.text_color }}>{p.text_color}</span></td>
//                   <td><span style={{ backgroundColor: p.text_bg, padding: '2px 6px' }}>{p.text_bg}</span></td>
//                   <td>{p.remarks}</td>
//                   <td>{p.is_active ? 'Active' : 'Inactive'}</td>
//                   <td>
//                     <Button
//                       size="sm"
//                       variant="warning"
//                       onClick={() => handleShowModal(p)}
//                       className="me-2"
//                     >
//                       Edit
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant={p.is_active ? 'danger' : 'success'}
//                       onClick={() => toggleProspectStatus(p.id, p.is_active ? 'disable' : 'enable')}
//                     >
//                       {p.is_active ? 'Disable' : 'Enable'}
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>

//           {/* Modal */}
//           <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//             <Modal.Header closeButton>
//               <Modal.Title>{editProspect ? 'Edit' : 'Add'} Prospect</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               <Form>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Prospect Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={form.prospect_name}
//                     onChange={(e) => setForm({ ...form, prospect_name: e.target.value })}
//                     required
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Text Color</Form.Label>
//                   <Form.Control
//                     type="color"
//                     value={form.text_color}
//                     onChange={(e) => setForm({ ...form, text_color: e.target.value })}
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Background Color</Form.Label>
//                   <Form.Control
//                     type="color"
//                     value={form.text_bg}
//                     onChange={(e) => setForm({ ...form, text_bg: e.target.value })}
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
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
//                 {editProspect ? 'Update' : 'Create'}
//               </Button>
//             </Modal.Footer>
//           </Modal>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProspectPage;




import React, { useEffect, useState } from 'react';
import {
  Button, Modal, Form, Row, Col, ToggleButtonGroup, ToggleButton
} from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from './adminsidebar';
import TopNavbar from '../components/TopNavbar';
import { Api } from '../api';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

function ProspectPage() {
  const [prospects, setProspects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editProspect, setEditProspect] = useState(null);
  const [form, setForm] = useState({
    prospect_name: '',
    text_color: '#000000',
    text_bg: '#ffffff',
    remarks: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProspects = async () => {
    try {
      const res = await axios.get(`${Api}/master/view_allProspects/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setProspects(res.data);
    } catch (err) {
      console.error('Failed to fetch prospects:', err);
    }
  };

  useEffect(() => {
    fetchProspects();
  }, []);

  const filteredProspects = prospects
    .filter((p) => {
      if (filter === 'active') return p.is_active;
      if (filter === 'inactive') return !p.is_active;
      return true;
    })
    .filter((p) =>
      p.prospect_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleShowModal = (prospect = null) => {
    setEditProspect(prospect);
    setForm(prospect ? {
      prospect_name: prospect.prospect_name,
      text_color: prospect.text_color || '#000000',
      text_bg: prospect.text_bg || '#ffffff',
      remarks: prospect.remarks || '',
    } : {
      prospect_name: '',
      text_color: '#000000',
      text_bg: '#ffffff',
      remarks: '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const url = editProspect
      ? `${Api}/master/update_Prospect/${editProspect.id}/`
      : `${Api}/master/create_Prospect/`;
    const method = editProspect ? 'put' : 'post';

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
      fetchProspects();
    } catch (err) {
      console.error('Failed to save prospect:', err);
    }
  };

  const toggleProspectStatus = async (id, action) => {
    try {
      await axios.delete(`${Api}/master/${action}_Prospect/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchProspects();
    } catch (err) {
      console.error(`Failed to ${action} prospect:`, err);
    }
  };

  const columns = [
    { field: 'prospect_name', headerName: 'Name', flex: 1 },
    {
      field: 'text_color',
      headerName: 'Text Color',
      flex: 1,
      renderCell: (params) => (
        <span style={{ color: params.value }}>{params.value}</span>
      )
    },
    {
      field: 'text_bg',
      headerName: 'Background',
      flex: 1,
      renderCell: (params) => (
        <span style={{
          backgroundColor: params.value,
          padding: '4px 8px',
          borderRadius: '4px'
        }}>{params.value}</span>
      )
    },
    { field: 'remarks', headerName: 'Remarks', flex: 2 },
    {
      field: 'is_active',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (params.value ? 'Active' : 'Inactive')
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
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
              toggleProspectStatus(
                params.row.id,
                params.row.is_active ? 'disable' : 'enable'
              )
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
        <div className="p-4 flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
          <Row className="mb-3 align-items-center">
            <Col><h3>Prospects</h3></Col>
            <Col className="text-end">
              <Button onClick={() => handleShowModal()} variant="primary">+ Add Prospect</Button>
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
            {/* <DataGrid
              rows={filteredProspects}
              columns={columns}
              getRowId={(row) => row.id}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
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
            /> */}
                        <DataGrid
                          rows={filteredProspects}
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
              <Modal.Title>{editProspect ? 'Edit' : 'Add'} Prospect</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Prospect Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.prospect_name}
                    onChange={(e) => setForm({ ...form, prospect_name: e.target.value })}
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
                {editProspect ? 'Update' : 'Create'}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default ProspectPage;
