import React from 'react'
import Sidebar from '../../components/common/Sidebar'
import Navbar from '../../components/common/Navbar'
import RightSidebar from '../../components/common/RightSidebar'
import FeedPage from '../../components/common/Feed'

const HomePage = () => {
  return (
    <>
     <Navbar/>
     <FeedPage/>
     <RightSidebar/>
    </>
  )
}

export default HomePage
