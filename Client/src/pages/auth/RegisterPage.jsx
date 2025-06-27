import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';
import Apis from '../../config/apis';
import webLogo from '../../assets/Ora bg.png';

const Register = () => {
  const [inputType, setInputType] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setInputType(showPassword ? 'password' : 'text');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${Apis.auth}/pre-signup`, {
        username,
        email,
        password,
      });
      
      if (data.error) {
        setError(data.error);
      } else {
        setRegistrationSuccess(true);
        setEmail('');
        setUsername('');
        setPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-body h-screen flex items-center justify-center">
      <div className="h-auto w-110 bg-gray rounded-xl py-10 px-5">
      <div className="text-center">
          <img src={webLogo} className="h-20 w-auto mx-auto" alt="Ora Logo" />
          <h1 className="text-3xl font-semibold text-skin">Create Account</h1>
          <p className="text-sm text-skinLight mt-2">Join our community</p>
        </div>
      <form onSubmit={handleFormSubmit}>
          <div className="flex flex-col space-y-4 mt-6">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-midGray outline-none text-skin border-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-midGray outline-none text-skin border-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="flex px-4 py-2 rounded-lg bg-midGray outline-none text-skin">
                <input
                  id="password"
                  type={inputType}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full outline-none text-skin border-none bg-transparent"
                />
                <button
                  type="button"
                  className="cursor-pointer flex items-center justify-center"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff className='text-skin' /> : <FiEye className='text-skin' />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-skin text-sm">Remember me</span>
              </label>
              
              <Link to="/login" className='text-skin text-right text-sm hover:underline'>
                Already have an account?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-skin text-gray px-4 py-2 rounded-lg hover:bg-skinDark transition-colors cursor-pointer disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </div>
        </form>
        {registrationSuccess ? (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
            <h3 className="font-semibold">Registration Successful!</h3>
            <p className="mt-2">
              We've sent an activation link to your email. 
              Please check your inbox and click the link to activate your account.
            </p>
            <p className="mt-2 text-sm">
              Didn't receive the email?{' '}
              <button 
                className="text-blue-600 hover:underline"
                onClick={handleFormSubmit}
              >
                Resend activation email
              </button>
            </p>
          </div>
        ) : error ? (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        ) : null}

        {!registrationSuccess && (
          <form onSubmit={handleFormSubmit}>
          </form>
        )}
      </div>
    </div>
  );

};

export default Register;