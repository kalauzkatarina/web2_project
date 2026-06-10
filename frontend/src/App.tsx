import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import './index.css';
import { AuthProvider } from './contexts/auth_context/AuthContext';
import LoginPage from './pages/login/LoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import TravelPlansPage from './pages/travelPlan/TravelPlansPage';
import TravelPlanDetailsPage from './pages/travelPlan/TravelPlanDetailsPage';
import MainLayout from './components/layout/MainLayout';
import CreateTravelPlanPage from './pages/travelPlan/CreateTravelPlanPage';
import EditTravelPlanPage from './pages/travelPlan/EditTravelPlanPage';
import CreateDestinationPage from './pages/destination/CreateDestinationPage';
import EditDestinationPage from './pages/destination/EditDestinationPage';

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
                <MainLayout>
                  <TravelPlansPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/plans/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <TravelPlanDetailsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/plans/create"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CreateTravelPlanPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/plans/:id/edit"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <EditTravelPlanPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/plans/:id/destinations/create"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CreateDestinationPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/destinations/:id/edit"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <EditDestinationPage />
                </MainLayout>
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
