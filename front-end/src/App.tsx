import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import Dashboard from './pages/Dashboard/Dashboard';
import BanList from './pages/Bans/BanList';
import BanDetails from './pages/Bans/BanDetails';
import CreateBan from './pages/Bans/CreateBan';
import NotFound from './pages/NotFound';
import './index.css'

const App: React.FC = () => {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bans" element={<BanList />} />
          <Route path="/bans/:id" element={<BanDetails />} />
          <Route path="/bans/create" element={<CreateBan />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
};

export default App;