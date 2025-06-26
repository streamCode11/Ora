import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../pages/dashboard/HomePage'
import MainPage from '../pages/MainPage'
import LoginPage from '../pages/auth/LoginPage'
import Profile from '../components/profile/Profile'
import Register from '../pages/auth/RegisterPage'
import ActivateAccount from '../pages/auth/ActivateAcc'

const MainRoutes = () => {
  return (
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/auth/:token" element={<ActivateAccount/>}/>
        
        <Route path="/" element={<MainPage/>}>
          <Route index element={<HomePage/>}/>
          <Route path='/home' element={<HomePage/>}/>
          <Route path="profile" element={<Profile/>}/>
        </Route>
      </Routes>
  )
}

export default MainRoutes
