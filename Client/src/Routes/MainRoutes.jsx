import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProfilePage from '../pages/profile/ProfilePage'
import HomePage from '../pages/dashboard/HomePage'
import MainPage from '../pages/MainPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

const MainRoutes = () => {
  return (
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path='/protectedRoute' element={<MainPage/>}>
          <Route path='/home' element={<HomePage/>}/>
        </Route>
      </Routes>
  )
}

export default MainRoutes
