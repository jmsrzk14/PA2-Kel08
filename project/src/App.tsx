import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import StudentDashboard from './pages/Student/Dashboard';
import LoginAdmin from './pages/Auth/Login';
import LoginSiswa from './pages/Student/Auth/Login';
import Register from './pages/Student/Auth/Register';
import ForgotPass from './pages/Student/Auth/forgot_pass';
import ChangePass from './pages/Student/Auth/change_pass';

function AppRoutes() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      if (token.startsWith('admin-')) {
        setUserRole('admin');
      } else if (token.startsWith('student-')) {
        setUserRole('student');
      } else {
        sessionStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserRole(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;
  
  return (
    <Routes>
      <Route
        path="/dashboard/*"
        element={
          isAuthenticated && userRole === 'admin' ? (
            <Dashboard />
          ) : (
            <Navigate to="/loginadmin" replace />
          )
        }
      />

      <Route
        path="/dashboard/student/*"
        element={
          isAuthenticated && userRole === 'student' ? (
            <StudentDashboard />
          ) : (
            <Navigate to="/loginsiswa" replace />
          )
        }
      />

      <Route
        path="/loginadmin"
        element={
          <LoginAdmin
            setIsAuthenticated={setIsAuthenticated}
            setUserRole={setUserRole}
          />
        }
      />

      <Route
        path="/loginsiswa"
        element={
          <LoginSiswa
            setIsAuthenticated={setIsAuthenticated}
            setUserRole={setUserRole}
          />
        }
      />

      <Route path="/register" element={<Register />} />
      <Route path="/forgot_pass" element={<ForgotPass />} />
      <Route path="/change_pass" element={<ChangePass />} />

      <Route
        path="/"
        element={
          isAuthenticated ? (
            userRole === 'admin' ? (
              <Navigate to="/dashboard/home" replace />
            ) : (
              <Navigate to="/dashboard/student/home" replace />
            )
          ) : (
            <Navigate to="/loginsiswa" replace />
          )
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
