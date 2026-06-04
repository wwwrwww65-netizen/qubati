import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Wallet from './pages/Wallet';
import Maintenance from './pages/Maintenance';
import Inspection from './pages/Inspection';
import Trips from './pages/Trips';
import Users from './pages/Users';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="inspection" element={<Inspection />} />
          <Route path="trips" element={<Trips />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
