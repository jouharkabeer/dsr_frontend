// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './login';

import AdminDashboard from './adminpages/dashboard';
import MaterialPage from './adminpages/material';
import SalesmanDashboard from './salesmanpages/dashboard';
import SalesPage from './salesmanpages/sales';
import CustomerPage from './adminpages/customer';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/material" element={<MaterialPage />} />
      <Route path="/admin/customer/" element={<CustomerPage/>} />



      <Route path="/salesman/dashboard" element={<SalesmanDashboard />} />
      <Route path="/salesman/sales" element={<SalesPage />} />
    </Routes>
  );
}

export default App;
