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

function DailySalesReportPage() {
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');

  const fetchSales = async () => {
    try {
      const res = await axios.get(`${Api}/sales/admin/report/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setSalesData(res.data);
      setFilteredData(res.data);
    } catch (err) {
      console.error('Failed to fetch sales data:', err);
    }
  };
console.log(salesData)
  useEffect(() => {
    fetchSales();
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
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text('LUMBER WORLD BUILDING MATERIAL TRADING L.L.C', 14, 15);
  doc.setFontSize(12);
  doc.text('DAILY SALES REPORT', 14, 23);
  doc.text(`Date: ${dateFilter || 'All'}`, 150, 23, { align: 'right' });

  const tableData = filteredData.map((item, index) => {
    const timber = (item.timber_material_name || []).join(', ');
    const hardware = (item.hardware_material_name || []).join(', ');
    const materials = [timber, hardware].filter(Boolean).join(', ');

    return [
      index + 1,
      item.customer_name || '—',
      item.call_status_name || '—',
      materials || '—',
      item.payment_recieved ? 'Yes' : 'No',
      item.order_value || '0',
      item.remarks || '—',
      item.time_in ? new Date(item.time_in).toLocaleTimeString() : '—',
      item.time_out ? new Date(item.time_out).toLocaleTimeString() : '—'
    ];
  });

  autoTable(doc, {
    head: [[
      'S.No', 'Customer', 'Fresh/Followup', 'Materials',
      'Payment', 'Total O/S', 'Remarks', 'Time In', 'Time Out'
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

  doc.save('Daily_Sales_Report.pdf');
};

  const columns = [
    // { field: 'sno', headerName: 'S.No', width: 70, valueGetter: (params) => params.api.getRowIndex(params.id) + 1 },
    {
  field: 'sno',
  headerName: 'S.No',
  width: 70,
//   renderCell: (params) => params.api.getRowIndex(params.id) + 1
},

    { field: 'customer_name', headerName: 'Customer', flex: 1 },
    { field: 'call_status', headerName: 'Fresh/Followup', flex: 1 },
{
  field: 'materials',
  headerName: 'Materials',
  flex: 2,
  valueGetter: (params) => {
    const timber = params?.row?.timber_material_name?.join(', ') || '';
    const hardware = params?.row?.hardware_material_name?.join(', ') || '';
    return [timber, hardware].filter(Boolean).join(', ') || '—';
  },
},

    {
      field: 'payment_recieved',
      headerName: 'Payment',
      width: 100,
      renderCell: (params) => (params.value ? 'Yes' : 'No')
    },
    {
      field: 'order_value',
      headerName: 'Total O/S',
      width: 120
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      flex: 1
    },
    {
      field: 'time_in',
      headerName: 'Time In',
      width: 120,
      renderCell: (params) => params.value ? new Date(params.value).toLocaleTimeString() : ''
    },
    {
      field: 'time_out',
      headerName: 'Time Out',
      width: 120,
      renderCell: (params) => params.value ? new Date(params.value).toLocaleTimeString() : ''
    },
  ];

  return (
    <div className="d-flex flex-column" style={{ height: '100vh' }}>
      <TopNavbar />
      <div className="d-flex flex-grow-1">
        <AdminSidebar />
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
        </div>
      </div>
    </div>
  );
}

export default DailySalesReportPage;
