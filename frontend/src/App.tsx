import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import './index.css';
import { AuthProvider } from './contexts/auth_context/AuthContext';
import LoginPage from './pages/login/LoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Javne rute */}
          <Route path="/login" element={<LoginPage />} />

          {/* Zaštićene rute */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {/* Ovde stavi komponentu za početnu/dashboard */}
                <div>Dobrodošli u aplikaciju!</div>
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
