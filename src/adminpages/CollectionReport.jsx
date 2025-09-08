import React, { useEffect, useState } from 'react';
import {
  Button, Row, Col, Form, InputGroup, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import axios from 'axios';
import { Api } from '../api';
import TopNavbar from '../components/TopNavbar';
import AdminSidebar from './adminsidebar';
import { DataGrid } from '@mui/x-data-grid';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Loader from '../components/Loader';
import XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import Pdficon from '@mui/icons-material/PictureAsPdfOutlined';
import Exelicon from '@mui/icons-material/DatasetOutlined';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { showToast } from '../components/ToastNotify';


function CollectionForcastReport() {

  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ start_date: "", end_date: "" });
  const [salesmans, setSalesmans] = useState([])
  const [filsalesman, setFilsalesman] = useState('')
  const today = new Date();
  const currentMonth = today.toLocaleDateString("en-CA").slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)

  const fetchsalesman = async () => {
    try{
      const res2 = await axios.get(`${Api}/user/view_activeSalesman/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setSalesmans(res2.data)
    } catch (err) {
      console.error('Failed to fetch customer data:', err);
    }
    }

const getDateFormat = () => {
  const day = String(today.getDate()).padStart(2, '0'); // 01, 02...
  const month = today.toLocaleString('en-US', { month: 'long' }); // January, February...
  const year = today.getFullYear(); // 2025
  return `${day} ${month} ${year}`;
};


const getMonthName = (selectedMonth) => {
  if (!selectedMonth) return "";

  // Convert "YYYY-MM" into a Date
  const [year, month] = selectedMonth.split("-");
  const date = new Date(year, month - 1); // month is 0-based

  // Format as "January 2025"
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
};



const ResetReport = () => {
  const newFilters = { start_date: "", end_date: "" };
  const newSalesman = '';

  setFilters(newFilters);
  setFilsalesman(newSalesman);
  setSelectedMonth(currentMonth)

  fetchColletionReport(newFilters, newSalesman); // pass directly
};

const fetchColletionReport = async (customFilters = filters, customSalesman = filsalesman) => {
  try {
    setLoading(true);
    const res = await axios.get(`${Api}/sales/admin/collection-report-by-date/`, {
      params: {
        month: selectedMonth,
        sales_id: customSalesman,
      },
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    });

    setFilteredData(res.data);
  } catch (err) {
    console.error("Error fetching report:", err);
  } finally {
    setLoading(false);
  }
};


const applyFilters = () => {
  if (
    (filters.start_date && filters.end_date) || 
    (!filters.start_date && !filters.end_date) || 
    filsalesman
  ) {
    fetchColletionReport();
  } else {
    showToast.error("Please select both dates");
  }
};

useEffect(() => {
  fetchColletionReport(); // initial load
  fetchsalesman();        // load salesman list
}, []); // empty dependency array → runs only once


const downloadExcel = () => {
  // Prepare data with S.No and keys
  const worksheetData = filteredData.map((row, index) => ({
    'S.No': index + 1,
    'Branch': row.branch_code,
    'Salesman': row.salesman_name,
    'Customer': row.customer_name,
    'Total Outstanding as per SOA': row.soa_amount || 0,
    [`Collection on ${getMonthName(selectedMonth)}`]: row.this_month_collection || 0,
    'Expected Collection': row.expected_payment_amount || 0,
    'Expected Date': row.expected_payment_date || "",
    'Mode of Collection': row.mode_of_collection || "",
    'Expected PDC': row.expected_pdc || 0,
    'Expected CDC': row.expected_cdc || 0,
    'Expected TT': row.expected_tt || 0,
    'Expected Cash': row.expected_cash || 0,
    'Collected PDC': row.collected_pdc || 0,
    'Collected CDC': row.collected_cdc || 0,
    'Collected TT': row.collected_tt || 0,
    'Collected Cash': row.collected_cash || 0,
  }));

  const headers = Object.keys(worksheetData[0]);
  const dataRows = worksheetData.map(obj => Object.values(obj));

  // Add totals row placeholder
  const totalRow = new Array(headers.length).fill("");
  totalRow[0] = "Total";

  const dataWithTitle = [
    [`Collection Forecast Report : ${getMonthName(selectedMonth)}, Generated on : ${getDateFormat()}`], // Title merged across columns
    // [`Report Generated: ${getDateFormat()}`], // Title merged across columns
    headers,
    ...dataRows,
    totalRow
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(dataWithTitle);

  // Merge title across all header columns
  const colCount = headers.length;
  worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: colCount - 1 } }, // Title row merge
    { s: { r: dataRows.length + 2, c: 0 }, e: { r: dataRows.length + 2, c: 3 } } // Total label merge
  ];

  // Calculate total row index (0-based)
  const totalRowIndex = dataRows.length + 2;

  // Columns to sum
  const sumCols = [
    'Total Outstanding as per SOA',
    `Collection on ${getMonthName(selectedMonth)}`,
    'Expected Collection',
    'Expected CDC',
    'Expected PDC',
    'Expected Cash',
    'Expected TT',
    'Collected CDC',
    'Collected PDC',
    'Collected Cash',
    'Collected TT'
  ];

  // Write total values directly (pre-calculated)
  sumCols.forEach(colName => {
    const colIndex = headers.indexOf(colName);
    if (colIndex === -1) return;

    // Sum values from worksheetData by column name
    const totalValue = worksheetData.reduce((sum, row) => {
      const val = Number(row[colName]) || 0;
      return sum + val;
    }, 0);

    const cellRef = XLSX.utils.encode_cell({ r: totalRowIndex, c: colIndex });
    worksheet[cellRef] = {
      v: totalValue,
      t: "n",
      s: { font: { bold: true } }
    };
  });

  // Style the title row
  worksheet["A1"].s = { font: { bold: true, sz: 18 }, alignment: { horizontal: "center", vertical: "center" } };

  // Define colors for header groups
  const yellowHeaders = ["Expected PDC", "Expected CDC", "Expected TT", "Expected Cash"];
  const greenHeaders = ["Collected PDC", "Collected CDC", "Collected TT", "Collected Cash"];

  // Style header row (row 2 in Excel, zero-based row 1)
  headers.forEach((header, colIdx) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 1, c: colIdx });
    if (!worksheet[cellAddress]) return; // safety check

    worksheet[cellAddress].s = {
      font: { bold: true },
      alignment: { horizontal: "center", vertical: "center" },
      fill: yellowHeaders.includes(header)
        ? { fgColor: { rgb: "FFFF99" } }
        : greenHeaders.includes(header)
          ? { fgColor: { rgb: "CCFFCC" } }
          : undefined
    };
  });

  // Style total row (last row)
  for (let c = 0; c < headers.length; c++) {
    const addr = XLSX.utils.encode_cell({ r: totalRowIndex, c });
    if (!worksheet[addr]) continue;
    worksheet[addr].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: "E0E0E0" } } // light gray background
    };
  }

  // Align merged "Total" label to the right
  const totalLabelCell = XLSX.utils.encode_cell({ r: totalRowIndex, c: 0 });
  if (worksheet[totalLabelCell]) {
    worksheet[totalLabelCell].s = {
      font: { bold: true },
      alignment: { horizontal: "right", vertical: "center" }
    };
  }

  // Auto column widths based on max string length in each column
  worksheet["!cols"] = headers.map((key) => {
    const colValues = [key, ...worksheetData.map(row => String(row[key] ?? ""))];
    const maxLength = Math.max(...colValues.map(v => v.length));
    return { wch: maxLength + 2 };
  });

  // Create workbook and append sheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Collection Forecast Report`);

  // Write workbook to binary array and trigger download
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(blob, `Collection_forecast_Report_${getDateFormat()}.xlsx`);
};


const downloadPDF = () => {
  const doc = new jsPDF({ orientation: 'landscape' });

  // Main heading
// Heading
doc.setFontSize(16);
doc.setFont('helvetica', 'bold');
doc.text('Collection Forecast Report', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

// Date (smaller, left-aligned, a bit lower)
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.text(getDateFormat(), 14, 22); // (x=14 for left margin, y=22 for below heading)

  // Table headers with grouping
  const head = [
    [
      { content: 'S.No', rowSpan: 2, styles: { valign: 'middle', halign: 'center', fontStyle: 'bold' } },
      { content: 'Branch', rowSpan: 2, styles: { valign: 'middle', halign: 'center', fontStyle: 'bold' } },
      { content: 'Salesman', rowSpan: 2, styles: { valign: 'middle', halign: 'center', fontStyle: 'bold' } },
      { content: 'Customer', rowSpan: 2, styles: { valign: 'middle', halign: 'center', fontStyle: 'bold' } },
      { content: 'This Month Collection', rowSpan: 2, styles: { valign: 'middle', halign: 'center', fontStyle: 'bold' } },
      { content: 'Total Outstanding as per SOA', rowSpan: 2, styles: { valign: 'middle', halign: 'center', fontStyle: 'bold' } },
      { content: 'Expected Payment', colSpan: 4, styles: { halign: 'center', fillColor: [155, 135, 13], fontStyle: 'bold' } },
      { content: 'Collected Payment', colSpan: 4, styles: { halign: 'center', fillColor: [0, 100, 0], fontStyle: 'bold' } }
    ],
    [
      { content: 'Expected PDC', styles: { fillColor: [155, 135, 13] } },
      { content: 'Expected CDC', styles: { fillColor: [155, 135, 13] } },
      { content: 'Expected TT', styles: { fillColor: [155, 135, 13] } },
      { content: 'Expected Cash', styles: { fillColor: [155, 135, 13] } },
      { content: 'Collected PDC', styles: { fillColor: [0, 100, 0] } },
      { content: 'Collected CDC', styles: { fillColor: [0, 100, 0] } },
      { content: 'Collected TT', styles: { fillColor: [0, 100, 0] } },
      { content: 'Collected Cash', styles: { fillColor: [0, 100, 0] } }
    ]
  ];

  // Table body
  const body = filteredData.map((row, index) => [
    index + 1,
    row.branch_code,
    row.salesman_name,
    row.customer_name,
    row.this_month_collection,
    row.soa_amount,
    row.expected_pdc,
    row.expected_cdc,
    row.expected_tt,
    row.expected_cash,
    row.collected_pdc,
    row.collected_cdc,
    row.collected_tt,
    row.collected_cash
  ]);

  // Totals row
  const sum = (field) => filteredData.reduce((acc, r) => acc + (Number(r[field]) || 0), 0);

body.push([
  { content: 'Total', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } }, // S.No - Customer
  { content: sum('this_month_collection'), styles: { fontStyle: 'bold' } },  // This Month Collection
  { content: sum('soa_amount'), styles: { fontStyle: 'bold' } },  // SOA
  { content: sum('expected_pdc'), styles: { fontStyle: 'bold' } }, // Expected PDC
  { content: sum('expected_cdc'), styles: { fontStyle: 'bold' } }, // Expected CDC
  { content: sum('expected_tt'), styles: { fontStyle: 'bold' } },  // Expected TT
  { content: sum('expected_cash'), styles: { fontStyle: 'bold' } },// Expected Cash
  { content: sum('collected_pdc'), styles: { fontStyle: 'bold' } },// Collected PDC
  { content: sum('collected_cdc'), styles: { fontStyle: 'bold' } },// Collected CDC
  { content: sum('collected_tt'), styles: { fontStyle: 'bold' } }, // Collected TT
  { content: sum('collected_cash'), styles: { fontStyle: 'bold' } } // Collected Cash
]);

  // Render table
  autoTable(doc, {
    head: head,
    body: body,
    startY: 25,
    styles: { fontSize: 8, halign: 'center', valign: 'middle' }
  });

  // Save PDF
  doc.save(`Collection_Forecast_Report_${getDateFormat()}.pdf`);
};


  const columns = [
    {
  field: 'sno',
  headerName: 'S.No',
  width: 70,
  renderCell: (params) => params.api.getAllRowIds().indexOf(params.id)+1
},
    { field: 'branch_code', headerName: 'Branch', width : 150,  },
    { field: 'salesman_name', headerName: 'SalesMan', width : 150,  },
    { field: 'customer_name', headerName: 'Customer Name', width : 150,  },
    { field: 'this_month_collection', headerName: `Collection ${currentMonth}`, width : 150,  },
    { field: 'soa_amount', headerName: 'Total Outstading Per SOA', width : 150,  },
    { field: 'expected_payment_date', headerName: 'Expected Date', width : 150,  },
    { field: 'expected_payment_amount', headerName: 'Expected Collection', width: 150, },
    { field: 'mode_of_collection', headerName: 'Mode of Collection', width: 150, },
    { field: 'expected_pdc', headerName: 'Expected PDC', width: 150, },
    { field: 'expected_cdc', headerName: 'Expected CDC', width: 150, },
    { field: 'expected_cash', headerName: 'Expected CASH', width: 150, },
    { field: 'expected_tt', headerName: 'Expected TT', width: 150, },
    { field: 'collected_pdc', headerName: 'Collected PDC', width: 150, },
    { field: 'collected_cdc', headerName: 'Collected CDC', width: 150, },
    { field: 'collected_cash', headerName: 'Collected CASH', width: 150, },
    { field: 'collected_tt', headerName: 'Collected TT', width: 150, },
  ];


  return (
    <div className="d-flex flex-column" style={{ height: '100vh' }}>
      <TopNavbar />
      <div className="d-flex flex-grow-1">
        <AdminSidebar />
        {/* {loading ? <Loader/> :  */}
        <div className="p-4 flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
          <Row className="mb-3 align-items-end">
            <Col><h5>Collection Forecast Report</h5></Col>
            <Col md={3}>
                                  <Form.Group>
                                {/* <Form.Label>salesman</Form.Label> */}
                                <Form.Select
                                  value={filsalesman}
                                  onChange={(e) => setFilsalesman(e.target.value)}
                                >
                                  <option value="">Select Salesman</option>
                                  {salesmans.map((item) => (
                                    <option key={item.id} value={item.id}>{item.namefull}</option>
                                  ))}
                                </Form.Select>
                                  </Form.Group>
            </Col>
            <Col md={3}>
  <Form.Group>
    <Form.Control
      type="month"
      value={selectedMonth}
      max={currentMonth} 
      onChange={(e) => {
        setSelectedMonth(e.target.value);
        const [year, month] = e.target.value.split("-");
        setFilters({
          month: month,
          year: year
        });
      }}
      className="form-control"
    />
  </Form.Group>
</Col>
            <Col md="auto">
              <Button variant="warning" onClick={applyFilters}>Apply Filters</Button>
            </Col>
                        <Col md="auto">
                          <Button variant="danger" onClick={ResetReport}>Reset</Button>
                        </Col>
          </Row>
{loading ? <Loader/> : 
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
          </div>}
        </div>
      </div>
    </div>
  );
}
export default CollectionForcastReport;
