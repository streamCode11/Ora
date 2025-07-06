import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/dashboard/HomePage';
import LoginPage from './pages/auth/LoginPage';
import FeedPage from './pages/feed/FeedPage'; 
import ProtectedRoute from './Routes/protectedRoutes';
import './styles/main.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
