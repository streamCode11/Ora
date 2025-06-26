import React from 'react'
import HomePage from './dashboard/HomePage'
import Sidebar from '../components/common/Sidebar'
import { Outlet } from 'react-router-dom'

const MainPage = () => {
  return (
    <div className='flex'>
      <Sidebar/>
      <Outlet/>
    </div>
  )
}

export default MainPage
