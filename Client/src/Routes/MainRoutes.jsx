import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProfilePage from '../pages/profile/ProfilePage'

const MainRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/profile" element={<ProfilePage/>}/>
      </Routes>
    </div>
  )
}

export default MainRoutes
