import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AdminPage from './pages/AdminPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import TaskDetailPage from './pages/TaskDetailPage';

const PrivateRoute = ({ children, roles }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (roles && !roles.some(role => user.roles.includes(role))) {
        return <Navigate to="/" />; // Or a dedicated "unauthorized" page
    }

    return children;
};


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-100">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
              <Route path="/task/:taskId" element={<PrivateRoute><TaskDetailPage /></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminPage /></PrivateRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
