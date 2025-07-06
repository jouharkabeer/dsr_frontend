// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './login';

import AdminDashboard from './adminpages/dashboard';
import MaterialPage from './adminpages/material';
import MaterialCategoryPage from './adminpages/MaterialCategory';
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/materialcategory/" element={<MaterialCategoryPage />} />
      <Route path="/admin/material/" element={<MaterialPage />} />
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


      <Route path="/admin/hardwarematerialcategory/" element={<HardWareMaterialCategoryPage />} />
      <Route path="/admin/hardwarematerial/" element={<HardWareMaterialPage />} />      
      <Route path="/admin/timbermaterialcategory/" element={<TimberMaterialCategoryPage />} />
      <Route path="/admin/timbermaterial/" element={<TimberMaterialPage />} />        

      <Route path="/salesman/dashboard" element={<SalesmanDashboard />} />
      <Route path="/salesman/sales" element={<SalesPage />} />
    </Routes>
  );
}

export default App;
