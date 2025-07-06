import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/dashboard/HomePage';
import ProtectedRoute from './Routes/protectedRoutes';
import LoginPage from './pages/auth/LoginPage';
import './styles/main.css';
import Register from './pages/auth/RegisterPage';
import ActivateAccount from './pages/auth/ActivateAcc';
import MainPage from './pages/MainPage';
import ProfilePage from './pages/profile/ProfilePage';



function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/:token" element={<ActivateAccount />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;