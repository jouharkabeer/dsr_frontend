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
import { showToast } from '../components/ToastNotify'; 

function BranchPage() {
  const [branches, setBranches] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editBranch, setEditBranch] = useState(null);
  const [form, setForm] = useState({ branch_name: '', branch_code: '' , remarks: '' });
  const [error, setError] = useState('');

  const fetchBranches = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${Api}/master/view_allBranchs/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setBranches(res.data);
      setLoading(false)
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
      branch_code: branch.branch_code,
      remarks: branch.remarks || '',
    } : { branch_name: '', remarks: '', branch_code: '' });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    const trimmed = form.branch_name.trim();
    if (trimmed.length < 3 || /^\d+$/.test(trimmed)) {
      setError('Branch name must be at least 3 characters and not all numbers.');
      return;
    }

      const isDuplicate = filteredBranches.some(
        (branch) => branch.branch_code === form.branch_code.toUpperCase()
      );

      if (isDuplicate) {
        setError('This branch code is already taken');
        return;
      }


    if (!/^[a-zA-Z0-9]+$/.test(form.branch_code)) {
      setError('Spaces and special characters are not allowed in Branch Code');
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
          branch_code: form.branch_code,
          remarks: form.remarks,
          is_active: true
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setShowModal(false);
      fetchBranches();
      showToast.success(`Sucessfully ${editBranch ? 'Edited' : 'Created'} ${form.branch_name}`)
    } catch (err) {
      showToast.error(`Failed to ${editBranch ? 'Edit' : 'Create'}  ${form.branch_name}`)
      console.error('Failed to save branch:', err);
    }
  };

  const toggleStatus = async (id, action) => {
    try {
      await axios.delete(`${Api}/master/${action}_Branch/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      fetchBranches();
      showToast.success(`Sucessfully ${action}d ${form.branch_name}`)
    } catch (err) {
      showToast.error(`Failed to ${action} ${form.branch_name}`)
      console.error(`Failed to ${action} branch:`, err);
    }
  };

  const columns = [
    { field: 'branch_name', headerName: 'Name', width : 150,  },
    { field: 'branch_code', headerName: 'Code', width : 150,  },
    { field: 'remarks', headerName: 'Remarks', width : 150,  },
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
          <IconButton color="warning" onClick={() => handleShowModal(params.row)}><EditIcon /></IconButton>
          <IconButton
            color={params.row.is_active ? 'error' : 'success'}
            onClick={() => toggleStatus(params.row.id, params.row.is_active ? 'disable' : 'enable')}
          >
            {params.row.is_active ? <ToggleOnIcon /> : <ToggleOffIcon />}
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
            <Col><h3>Branches</h3></Col>
            <Col className="text-end">
              <Button onClick={() => handleShowModal()} variant="primary">+ Add</Button>
            </Col>
          </Row>

          <ToggleButtonGroup type="radio" name="filter" value={filter} onChange={setFilter} className="mb-3">
            <ToggleButton id="all" value="all" variant="outline-secondary">All</ToggleButton>
            <ToggleButton id="active" value="active" variant="outline-success">Active</ToggleButton>
            <ToggleButton id="inactive" value="inactive" variant="outline-danger">Inactive</ToggleButton>
          </ToggleButtonGroup>

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
              {error && <Alert style={{color: 'red', backgroundColor: 'white', fontSize: '12px', border: 'none'}}>{error}</Alert>}
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
                <Form.Group className="mb-3">
                  <Form.Label>Branch Code</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.branch_code}
                    onChange={(e) => setForm({ ...form, branch_code: e.target.value })}
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
        </div> }
      </div>
    </div>
  );
}

export default BranchPage;