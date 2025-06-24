import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import {FiEye , FiEyeOff} from 'react-icons/fi'
const LoginPage = () => {
  const [inputType, setInputType] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setInputType(showPassword ? 'text' : 'password');
  }
  return (
    <>
      <div className="bg-body h-screen flex items-center justify-center">
        <div className="h-auto w-130 bg-gray rounded-xl py-10 px-5">
            <div className="text-center ">
              <h1 className='text-skin text-5xl'>Ora</h1>
            </div>
            <form  >
              <div className="flex flex-col space-y-6 mt-8">
                <input
                  type="text"
                  placeholder="Email or Username"
                  className="w-full px-4 py-2 rounded-lg bg-midGray outline-none text-skin border-none"
                />
                <div className="flex px-4 py-2 rounded-lg bg-midGray outline-none text-skin">
                <input
                  type={inputType} 
                  placeholder={showPassword ? "********" : "Password"}
                  className="w-full  outline-none text-skin border-none"
                />
                <span className="cursor-pointer flex items-center justify-center" onClick={togglePasswordVisibility}>
                  {showPassword ? <FiEyeOff className='text-skin'/> : <FiEye className='text-skin'/>}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="">
                    <input
                      type="checkbox"
                      className="mr-2"
                    />
                    <label className="text-skin text-sm">Remember me</label>
                  </div>
                  <Link className='text-skin  text-right text-sm' to="/forget-password">
                  <h1>
                    forget password?
                  </h1>
                  </Link>
                </div>
                <button
                  type="submit"
                  className="w-full bg-skin text-gray px-4 py-2 rounded-lg hover:bg-skinDark transition-colors"
                >
                  Login
                </button>
              </div>
            </form>
        </div>
      </div>
    </>
  
  )
}

export default LoginPage
