import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import './index.css';
import { AuthProvider } from './contexts/auth_context/AuthContext';
import LoginPage from './pages/login/LoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import TravelPlansPage from './pages/travelPlan/TravelPlansPage';
import TravelPlanDetailsPage from './pages/travelPlan/TravelPlanDetailsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TravelPlansPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/plans/:id"
            element={
              <ProtectedRoute>
                <TravelPlanDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback ako neko kuca nepostojeću putanju */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
