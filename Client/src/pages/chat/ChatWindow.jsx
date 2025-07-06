import React from 'react'
import ShowUser from './ShowUser'
import ShowChat from './ShowChat'

const ChatWindow = () => {
  return (
    <div className='flex'>
      <ShowUser/>
      <ShowChat/>
    </div>
  )
}

export default ChatWindow
