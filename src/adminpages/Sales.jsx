// import React, { useEffect, useState } from 'react';
// import {
//   Button, Table, Modal, Form, ToggleButtonGroup, ToggleButton, Row, Col,
// } from 'react-bootstrap';
// import Select from 'react-select';
// import axios from 'axios';
// import AdminSidebar from './adminsidebar';
// import TopNavbar from '../components/TopNavbar';
// import { Api } from '../api';

// function SalesPage() {
//   const [sales, setSales] = useState([]);
//   const [filter, setFilter] = useState('all');
//   const [showModal, setShowModal] = useState(false);
//   const [editSales, setEditSales] = useState(null);
//   const [form, setForm] = useState({
//     material: [],
//     customer: '',
//     salesman: localStorage.getItem('user_id'),
//     call_status: '',
//     prospect: '',
//     order_status: '',
//     region: '',
//     payment_method: '',
//     expected_payment_amount: '',
//     expected_payment_date: '',
//     payment_recieved: '',
//     final_due_date: '',
//     quotation_provided: false,
//     quotation_value: '',
//     order_value: '',
//     remarks: '',
//   });

//   const [options, setOptions] = useState({
//     material: [],
//     customer: [],
//     salesman: [localStorage.getItem('user_id')],
//     call_status: [],
//     prospect: [],
//     order_status: [],
//     region: [],
//     payment_method: [],
//   });

//   const fetchOptions = async () => {
//     const endpoints = {
//       material: `${Api}/master/view_activeMaterial/`,
//       customer: `${Api}/master/view_activeCustomer/`,
//       call_status: `${Api}/master/view_activeCallStatus/`,
//       prospect: `${Api}/master/view_activeProspect/`,
//       order_status: `${Api}/master/view_activeOrderStatusType/`,
//       region: `${Api}/master/view_activeRegion/`,
//       payment_method: `${Api}/master/view_activePaymentMethod/`,
//     };

//     const fetchAll = Object.entries(endpoints).map(async ([key, url]) => {
//       const res = await axios.get(url, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
//       });
//       return [key, res.data];
//     });

//     const results = await Promise.all(fetchAll);
//     const newOptions = {};
//     results.forEach(([key, data]) => {
//       newOptions[key] = data;
//     });
//     setOptions(newOptions);
//   };

//   const fetchSales = async () => {
//     const url =
//       filter === 'active'
//         ? `${Api}/sales/view_activeSalesWeb/`
//         : `${Api}/sales/view_allSalesWebs/`;

//     const res = await axios.get(url, {
//       headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
//     });
//     setSales(res.data);
//   };

//   useEffect(() => {
//     fetchSales();
//     fetchOptions();
//   }, [filter]);

//   const handleShowModal = (salesItem = null) => {
//   setEditSales(salesItem);

//   setForm(salesItem
//     ? {
//         ...salesItem,
//         material: salesItem.material?.map((id) => {
//           const found = options.material.find((mat) => mat.id === id);
//           return found ? { value: found.id, label: found.material_name } : null;
//         }).filter(Boolean) || [],
//       }
//     : {
//         material: [],
//         customer: '',
//         salesman: localStorage.getItem('user_id'),
//         call_status: '',
//         prospect: '',
//         order_status: '',
//         region: '',
//         payment_method: '',
//         expected_payment_amount: '',
//         expected_payment_date: '',
//         payment_recieved: '',
//         final_due_date: '',
//         quotation_provided: false,
//         quotation_value: '',
//         order_value: '',
//         remarks: '',
//       });

//   setShowModal(true);
// };

//   const handleSave = async () => {
//     const url = editSales
//       ? `${Api}/sales/update_SalesWeb/${editSales.id}/`
//       : `${Api}/sales/create_SalesWeb/`;
//     const method = editSales ? 'put' : 'post';

//     const payload = {
//       ...form,
//       material: form.material.map((m) => m.value),
//     };

//     try {
//       await axios({
//         method,
//         url,
//         data: payload,
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       setShowModal(false);
//       fetchSales();
//     } catch (err) {
//       console.error('Failed to save sales record:', err);
//     }
//   };
// console.log(sales)
//   const toggleSalesStatus = async (id, action) => {
//     try {
//       await axios.delete(`${Api}/sales/${action}_SalesWeb/${id}/`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       fetchSales();
//     } catch (err) {
//       console.error(`Failed to ${action} SalesWeb:`, err);
//     }
//   };

//   return (
//     <div className="d-flex flex-column" style={{ height: '100vh' }}>
//       <TopNavbar />
//       <div className="d-flex flex-grow-1">
//         <AdminSidebar />
//         <div className="p-4 flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
//           <Row className="mb-3 align-items-center">
//             <Col><h3>Sales</h3></Col>
//             <Col className="text-end">
//               <Button onClick={() => handleShowModal()} variant="primary">+ Add Sales</Button>
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
//                 <th>Customer</th>
//                 <th>Materials</th>
//                 <th>Call Status</th>
//                 <th>Prospect</th>
//                 <th>Order Status</th>
//                 <th>Order Value</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sales.map((item) => (
//                 <tr key={item.id}>
//                   <td>{item.customer_name}</td>
//                   <td>{item.material_name}</td>
//                   <td>{item.call_status_name}</td>
//                   <td><div style={{textAlign: 'center', backgroundColor : item.prospect_bg, color : item.prospect_text, borderRadius: '10px'}}>{item.prospect_name}</div></td>
//                   <td><div style={{textAlign: 'center', backgroundColor : item.order_bg, color : item.order_text, borderRadius: '10px'}}>{item.order_status_name}</div></td>
//                   <td>{item.order_value}</td>
//                   <td>{item.is_active ? 'Active' : 'Inactive'}</td>
//                   <td>
//                     <Button
//                       size="sm"
//                       variant="warning"
//                       onClick={() => handleShowModal(item)}
//                       className="me-2"
//                     >
//                       Edit
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant={item.is_active ? 'danger' : 'success'}
//                       onClick={() => toggleSalesStatus(item.id, item.is_active ? 'disable' : 'enable')}
//                     >
//                       {item.is_active ? 'Disable' : 'Enable'}
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>

//           {/* Modal */}
//           <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
//             <Modal.Header closeButton>
//               <Modal.Title>{editSales ? 'Edit Sales' : 'Add Sales'}</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               <Form>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Materials</Form.Label>
//                   <Select
//                     isMulti
//                     options={options.material.map((mat) => ({ value: mat.id, label: mat.material_name }))}
//                     value={form.material}
//                     onChange={(selected) => setForm({ ...form, material: selected })}
//                   />
//                 </Form.Group>

                // {[
                //   ['customer', 'Customer', 'customer_name'],
                //   ['call_status', 'Call Status', 'call_status_name'],
                //   ['prospect', 'Prospect', 'prospect_name'],
                //   ['order_status', 'Order Status', 'order_type_name'],
                //   ['region', 'Region', 'region_name'],
                //   ['payment_method', 'Payment Method', 'payment_type_name'],
                // ].map(([field, label, nameKey]) => (
                //   <Form.Group className="mb-2" key={field}>
                //     <Form.Label>{label}</Form.Label>
                //     <Form.Select
                //       value={form[field]}
                //       onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                //     >
                //       <option value="">Select {label}</option>
                //       {options[field]?.map((item) => (
                //         <option value={item.id} key={item.id}>
                //           {item[nameKey] || item.name}
                //         </option>
                //       ))}
                //     </Form.Select>
                //   </Form.Group>
                // ))}

//                 <Row className="mb-2">
//                   <Col>
//                     <Form.Label>Expected Payment Amount</Form.Label>
//                     <Form.Control
//                       type="number"
//                       value={form.expected_payment_amount || ''}
//                       onChange={(e) => setForm({ ...form, expected_payment_amount: e.target.value })}
//                     />
//                   </Col>
//                   <Col>
                    // <Form.Label>Expected Payment Date</Form.Label>
                    // <Form.Control
                    //   type="date"
                    //   value={form.expected_payment_date || ''}
                    //   onChange={(e) => setForm({ ...form, expected_payment_date: e.target.value })}
                    // />
//                   </Col>
//                 </Row>

//                 <Row className="mb-2">
//                   <Col>
                    // <Form.Label>Payment Received</Form.Label>
                    // <Form.Control
                    //   type="number"
                    //   value={form.payment_recieved || ''}
                    //   onChange={(e) => setForm({ ...form, payment_recieved: e.target.value })}
                    // />
//                   </Col>
//                   <Col>
                    // <Form.Label>Due Date</Form.Label>
                    // <Form.Control
                    //   type="date"
                    //   value={form.final_due_date || ''}
                    //   onChange={(e) => setForm({ ...form, final_due_date: e.target.value })}
                    // />
//                   </Col>
//                 </Row>

//                 <Form.Group as={Row} className="mb-3">
//                   <Col>
//                     <Form.Check
//                       type="checkbox"
//                       label="Quotation Provided"
//                       checked={form.quotation_provided}
//                       onChange={(e) => setForm({ ...form, quotation_provided: e.target.checked })}
//                     />
//                   </Col>
//                 </Form.Group>

//                 {form.quotation_provided && (
//                   <Row className="mb-2">
//                     <Col>
//                       <Form.Label>Quotation Value</Form.Label>
//                       <Form.Control
//                         type="number"
//                         value={form.quotation_value || ''}
//                         onChange={(e) => setForm({ ...form, quotation_value: e.target.value })}
//                       />
//                     </Col>
//                     <Col>
//                       <Form.Label>Order Value</Form.Label>
//                       <Form.Control
//                         type="number"
//                         value={form.order_value || ''}
//                         onChange={(e) => setForm({ ...form, order_value: e.target.value })}
//                       />
//                     </Col>
//                   </Row>
//                 )}

//                 <Form.Group>
//                   <Form.Label>Remarks</Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={2}
//                     value={form.remarks}
//                     onChange={(e) => setForm({ ...form, remarks: e.target.value })}
//                   />
//                 </Form.Group>
//               </Form>
//             </Modal.Body>
//             <Modal.Footer>
//               <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
//               <Button variant="primary" onClick={handleSave}>
//                 {editSales ? 'Update' : 'Create'}
//               </Button>
//             </Modal.Footer>
//           </Modal>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SalesPage;




// import React, { useEffect, useState } from 'react';
// import {
//   Button, Table, Modal, Form, ToggleButtonGroup, ToggleButton, Row, Col,
// } from 'react-bootstrap';
// import Select from 'react-select';
// import axios from 'axios';
// import AdminSidebar from './adminsidebar';
// import TopNavbar from '../components/TopNavbar';
// import { Api } from '../api';

// function SalesPage() {
//   const [sales, setSales] = useState([]);
//   const [filter, setFilter] = useState('all');
//   const [showModal, setShowModal] = useState(false);
//   const [editSales, setEditSales] = useState(null);
//   const [form, setForm] = useState({
//     customer: '',
//     salesman: localStorage.getItem('user_id'),
//     call_status: '',
//     prospect: '',
//     order_status: '',
//     payment_method: '',
//     expected_payment_amount: '',
//     expected_payment_date: '',
//     payment_recieved: '',
//     final_due_date: '',
//     quotation_provided: false,
//     quotation_value: '',
//     order_value: '',
//     remarks: '',
//   });

//   const [options, setOptions] = useState({
//     customer: [],
//     salesman: [localStorage.getItem('user_id')],
//     call_status: [],
//     prospect: [],
//     order_status: [],
//     payment_method: [],
//     timber_categories: [],
//     hardware_categories: [],
//   });

//   const [isTimber, setIsTimber] = useState(false);
//   const [isHardware, setIsHardware] = useState(false);
//   const [timberCategories, setTimberCategories] = useState([]);
//   const [timberMaterials, setTimberMaterials] = useState([]);
//   const [selectedTimberMaterials, setSelectedTimberMaterials] = useState([]);

//   const [hardwareCategories, setHardwareCategories] = useState([]);
//   const [hardwareMaterials, setHardwareMaterials] = useState([]);
//   const [selectedHardwareMaterials, setSelectedHardwareMaterials] = useState([]);

//   const fetchOptions = async () => {
//     const endpoints = {
//       customer: `${Api}/master/view_activeCustomer/`,
//       call_status: `${Api}/master/view_activeCallStatus/`,
//       prospect: `${Api}/master/view_activeProspect/`,
//       order_status: `${Api}/master/view_activeOrderStatusType/`,
//       payment_method: `${Api}/master/view_activePaymentMethod/`,
//       timber_categories: `${Api}/master/view_activeTimberMaterialCategory/`,
//       hardware_categories: `${Api}/master/view_activeHardWareMaterialCategory/`,
//     };

//     const fetchAll = Object.entries(endpoints).map(async ([key, url]) => {
//       const res = await axios.get(url, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
//       });
//       return [key, res.data];
//     });

//     const results = await Promise.all(fetchAll);
//     const newOptions = {};
//     results.forEach(([key, data]) => {
//       newOptions[key] = data;
//     });
//     setOptions(newOptions);
//   };

//   const fetchSales = async () => {
//     const url =
//       filter === 'active'
//         ? `${Api}/sales/view_activeSalesWeb/`
//         : `${Api}/sales/view_allSalesWebs/`;

//     const res = await axios.get(url, {
//       headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
//     });
//     setSales(res.data);
//   };
//     console.log(sales)

//   useEffect(() => {
//     fetchSales();
//     fetchOptions();
//   }, [filter]);

//   const handleSave = async () => {
//     if (!isTimber && !isHardware) {
//       alert("Select at least Timber or Hardware.");
//       return;
//     }

//     const url = editSales
//       ? `${Api}/sales/update_SalesWeb/${editSales.id}/`
//       : `${Api}/sales/create_SalesWeb/`;
//     const method = editSales ? 'put' : 'post';

//     const payload = {
//       ...form,
//       timbermaterials: selectedTimberMaterials.map((m) => m.value),
//       hardwarematerials: selectedHardwareMaterials.map((m) => m.value),
//     };

//     try {
//       await axios({
//         method,
//         url,
//         data: payload,
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('access_token')}`,
//         },
//       });
//       setShowModal(false);
//       fetchSales();
//     } catch (err) {
//       console.error('Failed to save sales record:', err);
//     }
//   };

//   return (
//     <div className="d-flex flex-column" style={{ height: '100vh' }}>
//       <TopNavbar />
//       <div className="d-flex flex-grow-1">
//         <AdminSidebar />
//         <div className="p-4 flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
//           <Row className="mb-3 align-items-center">
//             <Col><h3>Sales</h3></Col>
//             <Col className="text-end">
//               <Button onClick={() => setShowModal(true)} variant="primary">+ Add Sales</Button>
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
//                 <th>Customer</th>
//                 <th>Order Value</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sales.map((item) => (
//                 <tr key={item.id}>
//                   <td>{item.customer_name}</td>
//                   <td>{item.order_value}</td>
//                   <td>{item.is_active ? 'Active' : 'Inactive'}</td>
//                   <td>
//                     <Button
//                       size="sm"
//                       variant="warning"
//                       className="me-2"
//                       onClick={() => setEditSales(item) || setShowModal(true)}
//                     >
//                       Edit
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>

          // <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
          //   <Modal.Header closeButton>
          //     <Modal.Title>{editSales ? 'Edit Sales' : 'Add Sales'}</Modal.Title>
          //   </Modal.Header>
          //   <Modal.Body>
          //     <Form>
          //       <Form.Group className="mb-2">
          //         <Form.Label>Customer</Form.Label>
          //         <Form.Select
          //           value={form.customer}
          //           onChange={(e) => setForm({ ...form, customer: e.target.value })}
          //         >
          //           <option value="">Select Customer</option>
          //           {options.customer?.map((item) => (
          //             <option key={item.id} value={item.id}>{item.customer_name}</option>
          //           ))}
          //         </Form.Select>
          //       </Form.Group>

          //       <Form.Check
          //         type="checkbox"
          //         label="Is Timber Required?"
          //         checked={isTimber}
          //         onChange={(e) => {
          //           setIsTimber(e.target.checked);
          //           if (!e.target.checked) {
          //             setTimberCategories([]);
          //             setSelectedTimberMaterials([]);
          //           }
          //         }}
          //         className="mb-3"
          //       />

          //       {isTimber && (
          //         <>
          //           <Form.Group className="mb-2">
          //             <Form.Label>Timber Categories</Form.Label>
          //             <Select
          //               isMulti
          //               options={options.timber_categories.map((cat) => ({ value: cat.id, label: cat.timber_material_catagory_name }))}
          //               value={timberCategories}
          //               onChange={async (selected) => {
          //                 setTimberCategories(selected);
          //                 const res = await axios.post(`${Api}/master/filter_timber_materials/`, {
          //                   category_ids: selected.map((c) => c.value),
          //                 }, {
          //                   headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
          //                 });
          //                 setTimberMaterials(res.data.map((mat) => ({ value: mat.id, label: mat.timber_material_name })));
          //               }}
          //             />
          //           </Form.Group>

          //           <Form.Group className="mb-3">
          //             <Form.Label>Timber Materials</Form.Label>
          //             <Select
          //               isMulti
          //               options={timberMaterials}
          //               value={selectedTimberMaterials}
          //               onChange={setSelectedTimberMaterials}
          //             />
          //           </Form.Group>
          //         </>
          //       )}

          //       <Form.Check
          //         type="checkbox"
          //         label="Is Hardware Required?"
          //         checked={isHardware}
          //         onChange={(e) => {
          //           setIsHardware(e.target.checked);
          //           if (!e.target.checked) {
          //             setHardwareCategories([]);
          //             setSelectedHardwareMaterials([]);
          //           }
          //         }}
          //         className="mb-3"
          //       />

          //       {isHardware && (
          //         <>
          //           <Form.Group className="mb-2">
          //             <Form.Label>Hardware Categories</Form.Label>
          //             <Select
          //               isMulti
          //               options={options.hardware_categories.map((cat) => ({ value: cat.id, label: cat.hardware_material_catagory_name }))}
          //               value={hardwareCategories}
          //               onChange={async (selected) => {
          //                 setHardwareCategories(selected);
          //                 const res = await axios.post(`${Api}/master/filter_hardware_materials/`, {
          //                   category_ids: selected.map((c) => c.value),
          //                 }, {
          //                   headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
          //                 });
          //                 setHardwareMaterials(res.data.map((mat) => ({ value: mat.id, label: mat.hardware_material_name })));
          //               }}
          //             />
          //           </Form.Group>

          //           <Form.Group className="mb-3">
          //             <Form.Label>Hardware Materials</Form.Label>
          //             <Select
          //               isMulti
          //               options={hardwareMaterials}
          //               value={selectedHardwareMaterials}
          //               onChange={setSelectedHardwareMaterials}
          //             />
          //           </Form.Group>
          //         </>
          //       )}
          //       {[
          //         ['call_status', 'Call Status', 'call_status_name'],
          //         ['prospect', 'Prospect', 'prospect_name'],
          //         ['order_status', 'Order Status', 'order_type_name'],
          //         ['payment_method', 'Payment Method', 'payment_type_name'],
          //       ].map(([field, label, nameKey]) => (
          //         <Form.Group className="mb-2" key={field}>
          //           <Form.Label>{label}</Form.Label>
          //           <Form.Select
          //             value={form[field]}
          //             onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          //           >
          //             <option value="">Select {label}</option>
          //             {options[field]?.map((item) => (
          //               <option value={item.id} key={item.id}>
          //                 {item[nameKey] || item.name}
          //               </option>
          //             ))}
          //           </Form.Select>
          //         </Form.Group>
          //       ))}

          //       {/* Additional Form Fields Below This Point */}
          //       <Form.Group className="mb-2">
          //         <Form.Label>Order Value</Form.Label>
          //         <Form.Control
          //           type="number"
          //           value={form.order_value || ''}
          //           onChange={(e) => setForm({ ...form, order_value: e.target.value })}
          //         />
          //       </Form.Group>
          //           <Form.Label>Expected Payment Date</Form.Label>
          //           <Form.Control
          //             type="date"
          //             value={form.expected_payment_date || ''}
          //             onChange={(e) => setForm({ ...form, expected_payment_date: e.target.value })}
          //           />
          //         <Form.Label>Due Date</Form.Label>
          //           <Form.Control
          //             type="date"
          //             value={form.final_due_date || ''}
          //             onChange={(e) => setForm({ ...form, final_due_date: e.target.value })}
          //           />
          //                               <Form.Label>Payment Received</Form.Label>
          //           <Form.Control
          //             type="number"
          //             value={form.payment_recieved || ''}
          //             onChange={(e) => setForm({ ...form, payment_recieved: e.target.value })}
          //           />
          //       <Form.Group className="mb-2">
          //         <Form.Label>Remarks</Form.Label>
          //         <Form.Control
          //           as="textarea"
          //           rows={2}
          //           value={form.remarks}
          //           onChange={(e) => setForm({ ...form, remarks: e.target.value })}
          //         />
          //       </Form.Group>
          //     </Form>
          //   </Modal.Body>
          //   <Modal.Footer>
          //     <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          //     <Button variant="primary" onClick={handleSave}>{editSales ? 'Update' : 'Create'}</Button>
          //   </Modal.Footer>
          // </Modal>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SalesPage;


import React, { useEffect, useState } from 'react';
import {
  Button, Modal, Form, Row, Col, ToggleButtonGroup, ToggleButton,
} from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import AdminSidebar from './adminsidebar';
import TopNavbar from '../components/TopNavbar';
import { Api } from '../api';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';


function SalesPage() {
  const [sales, setSales] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editSales, setEditSales] = useState(null);
  const [form, setForm] = useState({
    customer: '',
    salesman: localStorage.getItem('user_id'),
    call_status: '',
    prospect: '',
    order_status: '',
    payment_method: '',
    expected_payment_amount: '',
    expected_payment_date: '',
    payment_recieved: '',
    final_due_date: '',
    quotation_provided: false,
    quotation_value: '',
    order_value: '',
    remarks: '',
  });

  const [options, setOptions] = useState({
    customer: [], call_status: [], prospect: [], order_status: [],
    payment_method: [], timber_categories: [], hardware_categories: [],
  });

  const [isTimber, setIsTimber] = useState(false);
  const [timberCategories, setTimberCategories] = useState([]);
  const [timberMaterials, setTimberMaterials] = useState([]);
  const [selectedTimberMaterials, setSelectedTimberMaterials] = useState([]);

  const [isHardware, setIsHardware] = useState(false);
  const [hardwareCategories, setHardwareCategories] = useState([]);
  const [hardwareMaterials, setHardwareMaterials] = useState([]);
  const [selectedHardwareMaterials, setSelectedHardwareMaterials] = useState([]);

  const fetchOptions = async () => {
    const endpoints = {
      customer: `${Api}/master/view_activeCustomer/`,
      call_status: `${Api}/master/view_activeCallStatus/`,
      prospect: `${Api}/master/view_activeProspect/`,
      order_status: `${Api}/master/view_activeOrderStatusType/`,
      payment_method: `${Api}/master/view_activePaymentMethod/`,
      timber_categories: `${Api}/master/view_activeTimberMaterialCategory/`,
      hardware_categories: `${Api}/master/view_activeHardWareMaterialCategory/`,
    };
    const fetchAll = Object.entries(endpoints).map(async ([key, url]) => {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      return [key, res.data];
    });
    const results = await Promise.all(fetchAll);
    const newOptions = {};
    results.forEach(([key, data]) => { newOptions[key] = data; });
    setOptions(newOptions);
  };

  const fetchSales = async () => {
    const url = filter === 'active'
      ? `${Api}/sales/view_activeSalesWeb/`
      : `${Api}/sales/view_allSalesWebs/`;
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    });
    setSales(res.data);
  };
console.log(sales)
  useEffect(() => {
    fetchSales();
    fetchOptions();
  }, [filter]);

  const handleSave = async () => {
    if (!isTimber && !isHardware) {
      alert("Select at least Timber or Hardware.");
      return;
    }

    const url = editSales
      ? `${Api}/sales/update_SalesWeb/${editSales.id}/`
      : `${Api}/sales/create_SalesWeb/`;
    const method = editSales ? 'put' : 'post';

    const payload = {
      ...form,
      timbermaterials: selectedTimberMaterials.map((m) => m.value),
      hardwarematerials: selectedHardwareMaterials.map((m) => m.value),
    };

    try {
      await axios({
        method,
        url,
        data: payload,
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      setShowModal(false);
      fetchSales();
    } catch (err) {
      console.error('Failed to save sales record:', err);
    }
  };

  const toggleStatus = async (id, action) => {
    try {
      await axios.delete(`${Api}/master/${action}_HardWareMaterialCategory/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      fetchSales();
    } catch (err) {
      console.error(`Failed to ${action} item:`, err);
    }
  };

  const filteredSales = sales
  .filter((mat) => {
      if (filter === 'active') return mat.is_active;
      if (filter === 'inactive') return !mat.is_active;
      return true;
    })
  sales.filter(item =>
    item.customer_name?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { field: 'customer_name', headerName: 'Customer', flex: 1 },
    { field: 'order_value', headerName: 'Order Value', flex: 1 },
    { field: 'hardware_material_name', headerName: 'Timber Materials', flex: 1 },
    { field: 'timber_material_name', headerName: 'Hardware Materials', flex: 1 },
{
  field: 'prospect_name',
  headerName: 'Prospect',
  flex: 1,
  renderCell: (params) => (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '13%'}}>
      <div
        style={{
          backgroundColor: params.row.prospect_bg || '#eee',
          color: params.row.prospect_text || '#000',
          padding: '4px 12px',
          borderRadius: '999px',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '0.85rem',
          lineHeight: '1.2',
          display: 'inline-block',
          minWidth: '60px',
        }}
      >
        {params.value}
      </div>
    </div>
  )
},
{
  field: 'order_status_name',
  headerName: 'Order Status',
  flex: 1,
  renderCell: (params) => (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '13%'}}>
      <div
        style={{
          backgroundColor: params.row.order_bg || '#eee',
          color: params.row.order_text || '#000',
          padding: '4px 12px',
          borderRadius: '999px',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '0.85rem',
          lineHeight: '1.2',
          display: 'inline-block',
          minWidth: '60px',
        }}
      >
        {params.value}
      </div>
    </div>
  )
},
{
  field: 'call_status_name',
  headerName: 'Call Status',
  flex: 1,
},
        {
      field: "is_active",
      headerName: "Status",
      renderCell: (params) => (
        <div style={{ color: params.value ? "green" : "red" }}>
          <span
            style={{
              color: params.value ? "green" : "red",
              padding: "5px",
              borderRadius: "10px",
            }}
          >
            {params.value ? 'Active' : 'Inactive'}
          </span>
        </div>
      ),
      valueFormatter: (params) => (params.value ? "Active" : "Inactive"),
      valueOptions: ["Active", "Inactive"],
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
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
        <div className="p-4 flex-grow-1 overflow-auto" style={{ backgroundColor: '#f8f9fa' }}>
          <Row className="mb-3 align-items-center">
            <Col><h3>Sales</h3></Col>
            <Col className="text-end">
              <Button onClick={() => { setEditSales(null); setShowModal(true); }} variant="primary">+ Add</Button>
            </Col>
          </Row>

          <ToggleButtonGroup type="radio" name="filter" value={filter} onChange={setFilter} className="mb-3">
            <ToggleButton id="all" value="all" variant="outline-secondary">All</ToggleButton>
            <ToggleButton id="active" value="active" variant="outline-success">Active</ToggleButton>
            <ToggleButton id="inactive" value="inactive" variant="outline-danger">Inactive</ToggleButton>
          </ToggleButtonGroup>
          <div style={{ height: 600, width: '100%' }} className="bg-white p-3 rounded shadow-sm">
<DataGrid
  rows={filteredSales}
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
          <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{editSales ? 'Edit Sales' : 'Add Sales'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-2">
                  <Form.Label>Customer</Form.Label>
                  <Form.Select
                    value={form.customer}
                    onChange={(e) => setForm({ ...form, customer: e.target.value })}
                  >
                    <option value="">Select Customer</option>
                    {options.customer?.map((item) => (
                      <option key={item.id} value={item.id}>{item.customer_name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Check
                  type="checkbox"
                  label="Is Timber Required?"
                  checked={isTimber}
                  onChange={(e) => {
                    setIsTimber(e.target.checked);
                    if (!e.target.checked) {
                      setTimberCategories([]);
                      setSelectedTimberMaterials([]);
                    }
                  }}
                  className="mb-3"
                />

                {isTimber && (
                  <>
                    <Form.Group className="mb-2">
                      <Form.Label>Timber Categories</Form.Label>
                      <Select
                        isMulti
                        options={options.timber_categories.map((cat) => ({ value: cat.id, label: cat.timber_material_catagory_name }))}
                        value={timberCategories}
                        onChange={async (selected) => {
                          setTimberCategories(selected);
                          const res = await axios.post(`${Api}/master/filter_timber_materials/`, {
                            category_ids: selected.map((c) => c.value),
                          }, {
                            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
                          });
                          setTimberMaterials(res.data.map((mat) => ({ value: mat.id, label: mat.timber_material_name })));
                        }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Timber Materials</Form.Label>
                      <Select
                        isMulti
                        options={timberMaterials}
                        value={selectedTimberMaterials}
                        onChange={setSelectedTimberMaterials}
                      />
                    </Form.Group>
                  </>
                )}

                <Form.Check
                  type="checkbox"
                  label="Is Hardware Required?"
                  checked={isHardware}
                  onChange={(e) => {
                    setIsHardware(e.target.checked);
                    if (!e.target.checked) {
                      setHardwareCategories([]);
                      setSelectedHardwareMaterials([]);
                    }
                  }}
                  className="mb-3"
                />

                {isHardware && (
                  <>
                    <Form.Group className="mb-2">
                      <Form.Label>Hardware Categories</Form.Label>
                      <Select
                        isMulti
                        options={options.hardware_categories.map((cat) => ({ value: cat.id, label: cat.hardware_material_catagory_name }))}
                        value={hardwareCategories}
                        onChange={async (selected) => {
                          setHardwareCategories(selected);
                          const res = await axios.post(`${Api}/master/filter_hardware_materials/`, {
                            category_ids: selected.map((c) => c.value),
                          }, {
                            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
                          });
                          setHardwareMaterials(res.data.map((mat) => ({ value: mat.id, label: mat.hardware_material_name })));
                        }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Hardware Materials</Form.Label>
                      <Select
                        isMulti
                        options={hardwareMaterials}
                        value={selectedHardwareMaterials}
                        onChange={setSelectedHardwareMaterials}
                      />
                    </Form.Group>
                  </>
                )}
                {[
                  ['call_status', 'Call Status', 'call_status_name'],
                  ['prospect', 'Prospect', 'prospect_name'],
                  ['order_status', 'Order Status', 'order_type_name'],
                  ['payment_method', 'Payment Method', 'payment_type_name'],
                ].map(([field, label, nameKey]) => (
                  <Form.Group className="mb-2" key={field}>
                    <Form.Label>{label}</Form.Label>
                    <Form.Select
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    >
                      <option value="">Select {label}</option>
                      {options[field]?.map((item) => (
                        <option value={item.id} key={item.id}>
                          {item[nameKey] || item.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                ))}

                {/* Additional Form Fields Below This Point */}
                <Form.Group className="mb-2">
                  <Form.Label>Order Value</Form.Label>
                  <Form.Control
                    type="number"
                    value={form.order_value || ''}
                    onChange={(e) => setForm({ ...form, order_value: e.target.value })}
                  />
                </Form.Group>
                    <Form.Label>Expected Payment Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={form.expected_payment_date || ''}
                      onChange={(e) => setForm({ ...form, expected_payment_date: e.target.value })}
                    />
                  <Form.Label>Due Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={form.final_due_date || ''}
                      onChange={(e) => setForm({ ...form, final_due_date: e.target.value })}
                    />
                                        <Form.Label>Payment Received</Form.Label>
                    <Form.Control
                      type="number"
                      value={form.payment_recieved || ''}
                      onChange={(e) => setForm({ ...form, payment_recieved: e.target.value })}
                    />
                <Form.Group className="mb-2">
                  <Form.Label>Remarks</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={form.remarks}
                    onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSave}>{editSales ? 'Update' : 'Create'}</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default SalesPage;
