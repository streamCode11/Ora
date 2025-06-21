import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProfilePage from '../pages/profile/ProfilePage'
import HomePage from '../pages/dashboard/HomePage'
import MainPage from '../pages/MainPage'

const MainRoutes = () => {
  return (
      <Routes>
        <Route path="/login" element={<ProfilePage/>}/>
        <Route path='/protectedRoute' element={<MainPage/>}>
          <Route path='/home' element={<HomePage/>}/>
        </Route>
      </Routes>
  )
}

export default MainRoutes
