// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import { BrowserRouter } from 'react-router-dom';
import { SidebarProvider } from "./context/SidebarContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <SidebarProvider>
    <App />
  </SidebarProvider>
  </BrowserRouter>
);
