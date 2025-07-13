import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/dashboard/HomePage";
import ProtectedRoute from "./Routes/protectedRoutes";
import LoginPage from "./pages/auth/LoginPage";
import Register from "./pages/auth/RegisterPage";
import ActivateAccount from "./pages/auth/ActivateAcc";
import MainPage from "./pages/MainPage";
import ProfilePage from "./pages/profile/ProfilePage";
import EditProfilePage from "./pages/profile/EditProfilePage";
import PostDetailPage from "./components/common/PostDetails";

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
        <Route path="edit-profile" element={<EditProfilePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="/post/:postId" element={<PostDetailPage/>}/>
      </Route>
    </Routes>
  );
}

export default App;