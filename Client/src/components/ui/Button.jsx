import React from 'react'

const Button = ({name}) => {
  return (
    <div className='text-sm  font-normal  text-skin  rounded-full  border border-skin'>
      <button className='cursor-pointer  py-2 px-4 '>{name}</button>
    </div>
  )
}

export default Button
