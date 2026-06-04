import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Wallet from './pages/Wallet';
import Maintenance from './pages/Maintenance';
import Inspection from './pages/Inspection';
import Trips from './pages/Trips';
import Users from './pages/Users';
import Login from './pages/Login';
import Engineers from './pages/Engineers';
import Vehicles from './pages/Vehicles';
import Stations from './pages/Stations';
import Shipping from './pages/Shipping';
import BillPayments from './pages/BillPayments';
import FuelManagement from './pages/FuelManagement';
import Reports from './pages/Reports';
import AuditTrail from './pages/AuditTrail';
import Notifications from './pages/Notifications';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const contentArea = document.querySelector('.content-area');
    if (contentArea) {
      contentArea.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="inspection" element={<Inspection />} />
          <Route path="trips" element={<Trips />} />
          <Route path="users" element={<Users />} />

          {/* New Routes */}
          <Route path="engineers" element={<Engineers />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="stations" element={<Stations />} />
          <Route path="shipping" element={<Shipping />} />
          <Route path="bill-payments" element={<BillPayments />} />
          <Route path="fuel" element={<FuelManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="audit" element={<AuditTrail />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
