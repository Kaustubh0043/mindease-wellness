import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import MoodTracker from './pages/MoodTracker';
import Journal from './pages/Journal';
import Profile from './pages/Profile';
import Chatbot from './pages/Chatbot';
import Calibration from './pages/Calibration';
import AdminDashboard from './pages/AdminDashboard';
import AboutUs from './pages/AboutUs';
import Documentation from './pages/Documentation';
import NeuralPulse from './pages/NeuralPulse';
import CounselorDashboard from './pages/CounselorDashboard';
import './index.css';

const LayoutWrapper = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const isPublicPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/about' || location.pathname === '/docs';

  if (!user || isPublicPage) {
    return <div className="auth-wrapper">{children}</div>;
  }

  return (
    <div className="app-container" style={{ background: '#020617', minHeight: '100vh', width: '100%', position: 'relative', overflowX: 'hidden' }}>
      <Navbar />
      <main className="main-content" style={{ 
        marginLeft: '280px',
        width: 'calc(100% - 280px)',
        minHeight: '100vh',
        display: 'flex', 
        justifyContent: 'center',
        padding: '4rem 2rem'
      }}>
        <div style={{ width: '100%', maxWidth: '1100px' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CustomCursor />
      <Router>
        <LayoutWrapper>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* User Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute role="USER">
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/mood-tracker" element={
              <ProtectedRoute role="USER">
                <MoodTracker />
              </ProtectedRoute>
            } />
            <Route path="/journal" element={
              <ProtectedRoute role="USER">
                <Journal />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute role="USER">
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute role="USER">
                <Chatbot />
              </ProtectedRoute>
            } />
            <Route path="/calibration" element={
              <ProtectedRoute role="USER">
                <Calibration />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="/about" element={<AboutUs />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/pulse" element={<NeuralPulse />} />
            <Route path="/counselor" element={<CounselorDashboard />} />

            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </LayoutWrapper>
      </Router>
    </AuthProvider>
  );
}

export default App;
