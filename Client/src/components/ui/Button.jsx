import React from 'react'

const Button = ({name}) => {
  return (
    <div className='text-sm  font-normal  text-gray  rounded-full  border-2 border-mindaro '>
      <button className='cursor-pointer  py-2 px-4 '>{name}</button>
    </div>
  )
}

export default Button
