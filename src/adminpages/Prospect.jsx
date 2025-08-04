import React, { useEffect, useState } from 'react';
import {
  Button, Modal, Form, Row, Col, ToggleButtonGroup, ToggleButton
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
import { showToast } from '../components/ToastNotify';

function ProspectPage() {

  const [loading, setLoading] = useState(true);
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
      setLoading(true)
      const res = await axios.get(`${Api}/master/view_allProspects/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setProspects(res.data);
      setLoading(false)
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
      showToast.success(`Sucessfully ${editProspect ? 'Edited' : 'Created'} ${form.prospect_name}`)
    } catch (err) {
      showToast.error(`Failed to ${editProspect ? 'Edit' : 'Create'}  ${form.prospect_name}`)
      console.error('Failed to save prospect:', err);
    }
  };

  const toggleStatus = async (id, action) => {
    try {
      await axios.delete(`${Api}/master/${action}_Prospect/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchProspects();
      showToast.success(`Sucessfully ${action}d ${form.prospect_name}`)
    } catch (err) {
      showToast.error(`Failed to ${action} ${form.prospect_name}`)
      console.error(`Failed to ${action} prospect:`, err);
    }
  };

  const columns = [
    { field: 'prospect_name', headerName: 'Name', width : 150,  },
    {
      field: 'text_color',
      headerName: 'Text Color',
      width : 150, 
      renderCell: (params) => (
        <span style={{ color: params.value }}>{params.value}</span>
      )
    },
    {
      field: 'text_bg',
      headerName: 'Background',
      width : 150, 
      renderCell: (params) => (
        <span style={{
          backgroundColor: params.value,
          padding: '4px 8px',
          borderRadius: '4px'
        }}>{params.value}</span>
      )
    },
    { field: 'remarks', headerName: 'Remarks', width : 150,  },
    {
      field: 'is_active',
      headerName: 'Status',
      width : 150, 
      renderCell: (params) => (params.value ? 'Active' : 'Inactive')
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
        <AdminSidebar />
        {loading ? <Loader/> : 
        <div className="p-4 flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
          <Row className="mb-3 align-items-center">
            <Col><h3>Prospects</h3></Col>
            <Col className="text-end">
              <Button onClick={() => handleShowModal()} variant="primary">+ Add</Button>
            </Col>
          </Row>

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
        </div>}
      </div>
    </div>
  );
}

export default ProspectPage;
