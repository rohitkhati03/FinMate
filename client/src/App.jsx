import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import FinmateLanding from './components/Landing';
import Sidebar from './components/Sidebar';
import Loader from './components/Loader';

import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';

import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';
import Savings from './pages/Savings';
import Analytics from './pages/Analytics';


// 🔐 Protected Layout
const ProtectedLayout = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '240px', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
};


// 🚀 App Routes
const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <Routes>

      {/* 🌐 PUBLIC ROUTES */}
      <Route path="/" element={<FinmateLanding />} />

      <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to="/dashboard" />} 
      />

      <Route 
        path="/register" 
        element={!user ? <Register /> : <Navigate to="/dashboard" />} 
      />

      <Route path="/verify-otp" element={<VerifyOTP />} />


      {/* 🔒 PROTECTED ROUTES */}
      <Route 
        path="/dashboard" 
        element={<ProtectedLayout><Dashboard /></ProtectedLayout>} 
      />

      <Route 
        path="/expenses" 
        element={<ProtectedLayout><Expenses /></ProtectedLayout>} 
      />

      <Route 
        path="/groups" 
        element={<ProtectedLayout><Groups /></ProtectedLayout>} 
      />

      <Route 
        path="/groups/:id" 
        element={<ProtectedLayout><GroupDetail /></ProtectedLayout>} 
      />

      <Route 
        path="/savings" 
        element={<ProtectedLayout><Savings /></ProtectedLayout>} 
      />

      <Route 
        path="/analytics" 
        element={<ProtectedLayout><Analytics /></ProtectedLayout>} 
      />


      {/* ❌ FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
};


// 🧠 MAIN APP
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>

        {/* 🔔 Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1E293B',
              color: '#F1F5F9',
              border: '1px solid #334155'
            }
          }}
        />

        <AppRoutes />

      </AuthProvider>
    </BrowserRouter>
  );
}