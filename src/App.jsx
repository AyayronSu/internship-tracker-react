import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import { api } from './services/api';
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    api.checkAuth()
      .then(data => {
        if (data.is_logged_in) setUser(data.user);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <p>Verifying session...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="theme-toggle-container" style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
        <button onClick={() => setDarkMode(!darkMode)}className='theme-toggle'>
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      <Navbar></Navbar>

      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <LoginPage onLogin={(username) => setUser(username)} />}
        />

        <Route
          path="/signup"
          element={user ? <Navigate to="/" replace /> : <SignupPage onLogin={(username) => setUser(username)} />}
        />       

        <Route
          path="/"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <DashboardPage user={user} handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App