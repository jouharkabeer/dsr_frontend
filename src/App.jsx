// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './login';

import AdminDashboard from './adminpages/dashboard';
import SalesmanDashboard from './salesmanpages/dashboard';
import SalesPage from './salesmanpages/sales';
import CustomerPage from './adminpages/customer';
import UserPage from './adminpages/UserPage';
import UserTypePage from './adminpages/UserType';
import ProspectPage from './adminpages/Prospect';
import RegionPage from './adminpages/Region';
import BranchPage from './adminpages/Branch';
import PaymentMethodPage from './adminpages/PaymentMethod';
import CallStatusPage from './adminpages/CallStatus';
import OrderStatusTypePage from './adminpages/OrderStatusType';
import SalesPageAdmin from './adminpages/Sales';
import HardWareMaterialCategoryPage from './adminpages/HardWareMaterialCategory';
import HardWareMaterialPage from './adminpages/HardwareMaterial';
import TimberMaterialPage from './adminpages/TimberMaterials';
import TimberMaterialCategoryPage from './adminpages/TimberMaterialCategory';
import SalesMeet from './adminpages/SalesMeet';
import DailySalesReport from './adminpages/Report';
import CustomerSalesPage from './salesmanpages/customer_for_sales';
import Loader from './components/Loader';
import CollectionForcastReport from './adminpages/CollectionReport';
import ToastNotify from './components/ToastNotify';
import SalesManCollectionForcastReport from './salesmanpages/CollectionReportforSalesman';
import DailySalesManReportPage from './salesmanpages/SalesmanReport';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/customer/" element={<CustomerPage/>} />
      <Route path="/admin/userpage/" element={<UserPage/>} />
      <Route path="/admin/usertype/" element={<UserTypePage/>} />
      <Route path="/admin/branch/" element={<BranchPage/>} />
      <Route path="/admin/region/" element={<RegionPage/>} />
      <Route path="/admin/prospect/" element={<ProspectPage/>} />
      <Route path="/admin/paymentmethod/" element={<PaymentMethodPage/>} />
      <Route path="/admin/callstatus/" element={<CallStatusPage/>} />
      <Route path="/admin/ordertype/" element={<OrderStatusTypePage/>} />


      <Route path="/sales/salespage/" element={<SalesPageAdmin/>} />
      <Route path="/sales/salesmeet/" element={<SalesMeet/>} />
      <Route path="/sales/report/" element={<DailySalesReport/>} />
      <Route path="/sales/collectionreport/" element={<CollectionForcastReport/>} />


      <Route path="/admin/hardwarematerialcategory/" element={<HardWareMaterialCategoryPage />} />
      <Route path="/admin/hardwarematerial/" element={<HardWareMaterialPage />} />      
      <Route path="/admin/timbermaterialcategory/" element={<TimberMaterialCategoryPage />} />
      <Route path="/admin/timbermaterial/" element={<TimberMaterialPage />} />        

      <Route path="/salesman/dashboard" element={<SalesmanDashboard />} />
      <Route path="/salesman/customer" element={<CustomerSalesPage />} />
      <Route path="/salesman/sales" element={<SalesPage />} />
      <Route path="/salesman/sales/collectionreport" element={<SalesManCollectionForcastReport />} />
      <Route path="/salesman/sales/dailyreport" element={<DailySalesManReportPage />} />
      <Route path="/loader" element={<Loader />} />
    </Routes>
    <ToastNotify/>
    </>
  );
}

export default App;
