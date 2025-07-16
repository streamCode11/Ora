import { Route, Routes, useParams } from "react-router-dom";
import HomePage from "./pages/dashboard/HomePage";
import ProtectedRoute from "./Routes/protectedRoutes";
import LoginPage from "./pages/auth/LoginPage";
import Register from "./pages/auth/RegisterPage";
import { useState , useEffect } from "react";
import MainPage from "./pages/MainPage";
import ProfilePage from "./pages/profile/ProfilePage";
import EditProfilePage from "./pages/profile/EditProfilePage";
import PostDetailPage from "./components/common/PostDetails";
import ActivateAccount from "./pages/auth/ActivateAcc";
import ExplorePage from "./pages/dashboard/ExplorerPage";

function App() {
  const {id} = useParams();
  const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
      const fetchUser = async () => {
        const user = JSON.parse(localStorage.getItem("auth"));
        setCurrentUser(user.data);
      };
      fetchUser();
    }, []);
  
    const updateCurrentUser = (updatedUser) => {
      setCurrentUser(updatedUser);
    };
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
        <Route path="profile/:id" element={<ProfilePage />} />
        <Route
          path="explore"
          element={
            <ExplorePage
              currentUser={currentUser}
              updateCurrentUser={updateCurrentUser}
            />
          }
        />
        <Route path="/post/:postId" element={<PostDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;
