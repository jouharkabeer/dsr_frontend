import React, { useEffect, useState } from 'react';
import {
   Row, Col, ToggleButtonGroup, ToggleButton
} from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from './adminsidebar';
import TopNavbar from '../components/TopNavbar';
import { Api } from '../api';
import { DataGrid } from '@mui/x-data-grid';
import Loader from '../components/Loader';


function SalesMeet() {
  const [salesmeet, setSalesMeet] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchSalesMeet = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${Api}/sales/view_allSalesMobiles/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setSalesMeet(res.data);
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch regiones:', err);
    }
  };
console.log(salesmeet)
  useEffect(() => {
    fetchSalesMeet();
  }, []);

  const filteredSalesMeet = salesmeet.filter((b) => {
    if (filter === 'active') return b.is_active;
    if (filter === 'inactive') return !b.is_active;
    return true;
  });

  const columns = [
    { field: 'customer_name', headerName: 'Customer Name', width : 150,  },
    { field: 'salesman_name', headerName: 'salesman Name', width : 150,  },
    { field: 'timber_material_name', headerName: 'Timber Materials', width : 150,  },
    { field: 'hardware_material_name', headerName: 'Hardware Materials', width : 150,  },
    { field: 'remarks', headerName: 'Remarks', width:150 },
    {
      field: 'meeting_status',
      headerName: 'Meeted',
      width : 80,
      renderCell: (params) => (params.value ? '✅ Yes' : '❌ No'),
    },
    {
      field: 'payment_collected',
      headerName: 'Payment Collected',
      width : 80,
      renderCell: (params) => (params.value ? '✅ Yes' : '❌ No'),
    },
    { field: 'time_in', headerName: 'time in', width:150 },
    { field: 'time_out', headerName: 'time out', width:150 },
    { field: 'latitude', headerName: 'Latitude', width:150 },
    { field: 'longitude', headerName: 'Longitude', width:150 },

    {
      field: 'is_active',
      headerName: 'Status',
      width : 80,
      renderCell: (params) => (params.value ? 'Active' : 'Inactive'),
    },
  ];

  return (
    <div className="d-flex flex-column" style={{ height: '100vh' }}>
      <TopNavbar />
      <div className="d-flex flex-grow-1">
        <AdminSidebar />
        {loading ? <Loader/> :
        <div className="p-4 flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
          <Row className="mb-3 align-items-center">
            <Col><h3>Sales Meet</h3></Col>
          </Row>

          <ToggleButtonGroup type="radio" name="filter" value={filter} onChange={setFilter} className="mb-3">
            <ToggleButton id="all" value="all" variant="outline-secondary">All</ToggleButton>
            <ToggleButton id="active" value="active" variant="outline-success">Active</ToggleButton>
            <ToggleButton id="inactive" value="inactive" variant="outline-danger">Inactive</ToggleButton>
          </ToggleButtonGroup>

          <div style={{ height: 600, width: '100%' }} className="bg-white p-3 rounded shadow-sm">
            <DataGrid
              rows={filteredSalesMeet}
              columns={columns}
              getRowId={(row) => row.id}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 25]}
              checkboxSelection
              // disableRowSelectionOnClick
              // disableColumnMenu
              // disableDensitySelector
              showToolbar
              slotProps={{
                toolbar: {
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
            />
          </div>
        </div>}
      </div>
    </div>
  );
}

export default SalesMeet;