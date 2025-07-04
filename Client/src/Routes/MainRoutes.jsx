import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../pages/dashboard/HomePage'
import MainPage from '../pages/MainPage'
import LoginPage from '../pages/auth/LoginPage'
import ProfilePage from '../pages/profile/ProfilePage'
import Register from '../pages/auth/RegisterPage'
import ActivateAccount from '../pages/auth/ActivateAcc'
import EditProfilePage from '../pages/profile/EditProfilePage'

const MainRoutes = () => {
  return (
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/auth/:token" element={<ActivateAccount/>}/>
        
        <Route path="/" element={<MainPage/>}>
          <Route index element={<HomePage/>}/>
          {/* <Route path='/message' element={<ChatWindow/>}/> */}
          <Route path='/home' element={<HomePage/>}/>
          <Route path="profile" element={<ProfilePage/>}/>
          <Route path='/edit-profile' element={<EditProfilePage/>}/>
        </Route>
      </Routes>
  )
}

export default MainRoutes
