import React, { useEffect, useState } from 'react';
import {
  Button, Row, Col, Form, InputGroup, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import axios from 'axios';
import { Api } from '../api';
import TopNavbar from '../components/TopNavbar';
import SalesSidebar from './salesmansidebar';
import { DataGrid } from '@mui/x-data-grid';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Loader from '../components/Loader';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Pdficon from '@mui/icons-material/PictureAsPdfOutlined';
import Exelicon from '@mui/icons-material/DatasetOutlined';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function SalesManCollectionForcastReport() {

  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ start_date: "", end_date: "" });
  const [salesmans, setSalesmans] = useState([])
  const [dateRange, setDateRange] = useState([null, null]);


  const fetchsalesman = async () => {
    try{
      setLoading(true)
      const res2 = await axios.get(`${Api}/user/view_activeSalesman/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setSalesmans(res2.data)
      setLoading(false)
      console.log(salesmans)
    } catch (err) {
      console.error('Failed to fetch customer data:', err);
    }
    }

const fetchColletionReport = async () => {
  try {
    const cid = localStorage.getItem('user_id')
    // setLoading(true)
    const res = await axios.get(`${Api}/sales/admin/collection-report-by-date/`, {
      params: {
        start_date: filters.start_date,
        end_date: filters.end_date,
        sales_id: cid,
      },
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    });
    console.log(params)

    setFilteredData(res.data);
    setLoading(false)
  } catch (err) {
    console.error("Error fetching report:", err);
  }
};

  useEffect(() => {
    fetchColletionReport();
    fetchsalesman();
  }, []);


console.log(filteredData)


const downloadExcel = () => {
  // Convert filtered data to worksheet
  const worksheetData = filteredData.map((row, index) => ({
    'S.No': index + 1,
    'Customer': row.customer_name,
    'Salesman': row.salesman_name,
    'Branch': row.branch_code,
    'Mode of Collection': row.payment_method_name,
    'Expected Collection': row.expected_payment_amount,
    'Expected Date': row.expected_payment_date,
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Collection Forecast Report');

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  saveAs(blob, `Collection_forecast_Report.xlsx`);
};

const ResetReport = () =>{
  setFilters ({start_date: "", end_date: ""})
  setDateRange([null, null]); 
  fetchColletionReport()
}

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
  doc.text('COLLECTION FORECAST REPORT', 14, 23);
  // doc.text(`Date: ${dateFilter || today}`, 150, 23, { align: 'right' });

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
  doc.save(`Collection_Report_${today}.pdf`);
};


  const columns = [
    {
  field: 'sno',
  headerName: 'S.No',
  width: 70,
  renderCell: (params) => params.api.getAllRowIds().indexOf(params.id)+1
},

    { field: 'customer_name', headerName: 'Customer', width : 150,  },
    // { field: 'salesman_name', headerName: 'SalesMan', width : 150,  },
    { field: 'branch_code', headerName: 'Branch', width : 150,  },
    { field: 'payment_method_name', headerName: 'Mode of Collection', width: 150, },
    { field: 'quotation_value', headerName: 'Quotation Amount', width: 150, },
    { field: 'expected_payment_amount', headerName: 'Expected Collection', width: 150, },
    { field: 'expected_payment_date', headerName: 'Expected Date', width: 150, },
    { field: 'payment_recieved', headerName: 'Recived Amount', width: 150, },
    { field: 'due_amount', headerName: 'Due Amount', width: 150, },

  ];

  return (
    <div className="d-flex flex-column" style={{ height: '100vh' }}>
      <TopNavbar />
      <div className="d-flex flex-grow-1">
        <SalesSidebar />
        {loading ? <Loader/> : 
        <div className="p-4 flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
          <Row className="mb-3 align-items-end">
            <Col><h5>Collection Forecast Report</h5></Col>

            <Col md={3}>
  <DatePicker
    selectsRange
    startDate={dateRange[0]}
    endDate={dateRange[1]}
    onChange={(update) => {
      setDateRange(update);
      setFilters({
        start_date: update[0] ? update[0].toLocaleDateString("en-CA") : "",
        end_date: update[1] ? update[1].toLocaleDateString("en-CA") : ""
      });
    }}
    isClearable
    placeholderText="Select date range"
    className="form-control"
  />
</Col>
            <Col md="auto">
              <Button variant="secondary" onClick={fetchColletionReport}>Apply Filters</Button>
            </Col>
                        <Col md="auto">
                          <Button variant="danger" onClick={ResetReport}>Reset</Button>
                        </Col>
          </Row>

          <div style={{ height: 600, width: '100%' }} className="bg-white p-3 rounded shadow-sm">

  <Row className="justify-content-end mb-2">
  <Col xs="auto">
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>Download Excel</Tooltip>}
    >
      <div onClick={downloadExcel} style={{ cursor: 'pointer', color: '#007bff' }}>
        <Exelicon />
      </div>
    </OverlayTrigger>
  </Col>

  <Col xs="auto">
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>Download PDF</Tooltip>}
    >
      <div onClick={downloadPDF} style={{ cursor: 'pointer', color: '#007bff' }}>
        <Pdficon />
      </div>
    </OverlayTrigger>
  </Col>
</Row>
            <DataGrid
              rows={filteredData}
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
              showToolbar // ✅ NEW: enables full toolbar (search, export, columns)
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
export default SalesManCollectionForcastReport;
