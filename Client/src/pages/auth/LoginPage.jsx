import React from 'react'
import { Link } from 'react-router-dom'

const LoginPage = () => {
  return (
    <>
      <div className="bg-body h-screen flex items-center justify-center">
        <div className="h-auto w-130 bg-gray rounded-xl py-10 px-5">
            <div className="text-center ">
              <h1 className='text-skin text-5xl'>Ora</h1>
            </div>
            <form  >
              <div className="flex flex-col space-y-4 mt-8">
                <input
                  type="text"
                  placeholder="Email or Username"
                  className="w-full px-4 py-2 rounded-lg bg-midGray outline-none text-skin border-none"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 rounded-lg bg-midGray outline-none text-skin border-none"
                />
                <div className="flex justify-between items-center">
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
