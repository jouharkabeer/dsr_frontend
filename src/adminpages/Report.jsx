import React, { useEffect, useState } from 'react';
import {
  Button, Row, Col, Form, InputGroup
} from 'react-bootstrap';
import axios from 'axios';
import { Api } from '../api';
import TopNavbar from '../components/TopNavbar';
import AdminSidebar from './adminsidebar';
import { DataGrid } from '@mui/x-data-grid';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Loader from '../components/Loader';

function DailySalesReportPage() {
  const newtoday =  new Date().toISOString().split('T')[0];
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dateFilter, setDateFilter] = useState(newtoday);
  const [customerFilter, setCustomerFilter] = useState('');
  const [loading, setLoading] = useState(true)
console.log(dateFilter)
  
  const fetchReport = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${Api}/sales/admin/report/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setSalesData(res.data);
      setFilteredData(res.data);
      console.log(filteredData)
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch sales data:', err);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const filterSales = () => {
    let result = [...salesData];
    if (dateFilter) {
      result = result.filter((item) =>
        item.created_at?.startsWith(dateFilter)
      );
    }
    if (customerFilter.trim()) {
      result = result.filter((item) =>
        item.customer_name?.toLowerCase().includes(customerFilter.toLowerCase())
      );
    }
    setFilteredData(result);
  };



const downloadPDF = () => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit : 'mm',
    format : 'a4'
  });

  // Helper to format time
  const formatTime = (time) =>
    time ? new Date(time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—';

  const today = new Date().toISOString().split('T')[0];

  // Header
  doc.setFontSize(14);
  doc.text('LUMBER WORLD BUILDING MATERIAL TRADING L.L.C', 14, 15);
  doc.setFontSize(12);
  doc.text('DAILY SALES REPORT', 14, 23);
  doc.text(`Date: ${dateFilter || today}`, 150, 23, { align: 'right' });

  // Table data
  const tableData = filteredData.map((item, index) => {
    const timber = (item.timber_material_name || []).join(', ');
    const hardware = (item.hardware_material_name || []).join(', ');
    const saleDateTime = new Date(item.created_at).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
// Output: 24-Jul-2025, 02:35 PM


    return [
      index + 1,
      item.customer_name || '—',
      item.salesman_name || '_',
      item.call_status || '—',
      timber || '—',
      hardware || '—',
      saleDateTime || '—',
      item.payment_recieved ? 'Yes' : 'No',
      item.order_value || '0',
      item.remarks || '—',
      formatTime(item.time_in),
      formatTime(item.time_out),
    ];
  });

  // Table
  autoTable(doc, {
    head: [[
      'S.No',
      'Customer',
      'Sales Man',
      'Fresh/Followup',
      'Timber Materials',
      'Hardware Materials',
      'Date',
      'Payment',
      'Total O/S',
      'Remarks',
      'Time In',
      'Time Out'
    ]],
    body: tableData,
    startY: 30,
    styles: { fontSize: 9 },
    headStyles: {
      fillColor: [52, 73, 94],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 14, right: 14 },
  });

  // Save
  doc.save(`Daily_Report_${dateFilter || today}.pdf`);
};


  const columns = [
    // { field: 'sno', headerName: 'S.No', width: 70, valueGetter: (params) => params.api.getRowIndex(params.id) + 1 },
    {
  field: 'sno',
  headerName: 'S.No',
  width: 70,
  renderCell: (params) => params.api.getAllRowIds().indexOf(params.id)+1
},

    { field: 'customer_name', headerName: 'Customer', flex: 2 },
    { field: 'salesman_name', headerName: 'SalesMan', flex: 2 },
    { field: 'call_status', headerName: 'Fresh/Followup', flex: 1 },


    { field: 'timber_material_name', headerName: 'Timber Materials', flex : 2, },
    { field: 'hardware_material_name', headerName: 'Hardware Materials', flex : 2, },

    {
      field: 'payment_recieved',
      headerName: 'Payment',
      width : 150, 
      renderCell: (params) => (params.value ? '✅ Yes' : '❌ No'),
    },
    {
      field: 'order_value',
      headerName: 'Total O/S',
      flex :1,
    },
    {
      field: 'created_at',
      headerName : 'Sale Time',
      flex: 2,
    }, 
    {
      field: 'time_in',
      headerName: 'Time In',
      width : 150, 
      renderCell: (params) => params.value ? new Date(params.value).toLocaleTimeString() : ''
    },
    {
      field: 'time_out',
      headerName: 'Time Out',
      width : 150, 
      renderCell: (params) => params.value ? new Date(params.value).toLocaleTimeString() : ''
    },
    {
      field: 'remarks',
      headerName: 'Outcome of the call',
      flex: 1
    },
  ];

  return (
    <div className="d-flex flex-column" style={{ height: '100vh' }}>
      <TopNavbar />
      <div className="d-flex flex-grow-1">
        <AdminSidebar />
        {loading ? <Loader/> : 
        <div className="p-4 flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
          <Row className="mb-3 align-items-end">
            <Col><h4>Daily Sales Report</h4></Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Customer</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search Customer"
                  value={customerFilter}
                  onChange={(e) => setCustomerFilter(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md="auto">
              <Button variant="secondary" onClick={filterSales}>Apply Filters</Button>
            </Col>
            <Col md="auto">
              <Button variant="success" onClick={downloadPDF}>Download PDF</Button>
            </Col>
          </Row>

          <div style={{ height: 600, width: '100%' }} className="bg-white p-3 rounded shadow-sm">
            <DataGrid
            rowNumberDisplayMode="static"
              rows={filteredData}
              columns={columns}
              getRowId={(row) => row.id}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
              disableColumnMenu
            />
          </div>
        </div>}
      </div>
    </div>
  );
}

export default DailySalesReportPage;
