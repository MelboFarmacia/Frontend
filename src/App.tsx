import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './features/auth/pages/LoginPage';
import Welcome from './pages/Welcome';
import ProductsPage from './features/products/pages/ProductsPage';
import UbicacionesPage from './features/products/pages/UbicacionesPage';
import SalesPage from './features/sales/pages/SalesPage';
import ReportsPage from './features/reports/pages/ReportsPage';
import AdminPanel from './features/stats/pages/AdminPanel';
import React from 'react';
import HistoricoPage from './features/products/pages/HistoricoPage';
import UbicacionDetailPage from './features/products/pages/UbicacionDetailPage';
import { TransferView } from './features/products/components/TransferView';
function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/ubicaciones" element={<UbicacionesPage />} />
        <Route path="/ubicaciones/:id" element={<UbicacionDetailPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/products/historico" element={<HistoricoPage />} />
        <Route path="/transfer" element={<TransferView />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;