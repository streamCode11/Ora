import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../pages/dashboard/HomePage'
import MainPage from '../pages/MainPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import Profile from '../components/profile/Profile'

const MainRoutes = () => {
  return (
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/" element={<MainPage/>}>
          <Route index element={<HomePage/>}/>
          <Route path='/home' element={<HomePage/>}/>
          <Route path="profile" element={<Profile/>}/>
        </Route>
      </Routes>
  )
}

export default MainRoutes
