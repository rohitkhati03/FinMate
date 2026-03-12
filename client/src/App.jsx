import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar    from './components/Sidebar';
import Loader     from './components/Loader';
import Login      from './pages/Login';
import Register   from './pages/Register';
import Dashboard  from './pages/Dashboard';
import Expenses   from './pages/Expenses';
import Groups     from './pages/Groups';
import GroupDetail from './pages/GroupDetail';
import Savings    from './pages/Savings';
import Analytics  from './pages/Analytics';

const ProtectedLayout = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user)   return <Navigate to="/login" />;
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '240px', minHeight: '100vh', transition: 'margin 0.25s' }}>
        {children}
      </main>
    </div>
  );
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return (
    <Routes>
      <Route path="/login"    element={!user ? <Login />    : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      <Route path="/"          element={<ProtectedLayout><Dashboard  /></ProtectedLayout>} />
      <Route path="/expenses"  element={<ProtectedLayout><Expenses   /></ProtectedLayout>} />
      <Route path="/groups"    element={<ProtectedLayout><Groups     /></ProtectedLayout>} />
      <Route path="/groups/:id" element={<ProtectedLayout><GroupDetail /></ProtectedLayout>} />
      <Route path="/savings"   element={<ProtectedLayout><Savings    /></ProtectedLayout>} />
      <Route path="/analytics" element={<ProtectedLayout><Analytics  /></ProtectedLayout>} />
      <Route path="*"          element={<Navigate to="/" />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1E293B', color: '#F1F5F9', border: '1px solid #334155' }
        }}/>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
