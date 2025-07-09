import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import webLogo from '../../assets/Ora bg.png';
import axios from 'axios';
import Apis from '../../config/apis';
import { useAuth } from '../../context/auth';
import LoaderCom from '../../components/common/Loader';

const LoginPage = () => {
  const [inputType, setInputType] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setInputType(showPassword ? 'password' : 'text');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${Apis.auth}/login`, {
        email: credentials.email,
        password: credentials.password
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      const authData = {
        user: response.data.user,
        token: response.data.token,
        refreshToken: response.data.refreshToken
      };

      localStorage.setItem('auth', JSON.stringify(authData));
      setAuth(authData);

      // Show loader for a brief moment before redirecting
      setTimeout(() => {
        const redirectTo = location.state?.from?.pathname || '/';
        navigate(redirectTo, { replace: true });
      }, 2000); // 1 second delay to ensure loader is visible

    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Login failed. Please try again.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCom /> {/* Your custom loader component */}
        <p className="ml-2">Logging you in...</p>
      </div>
    );
  }

  return (
    <div className="bg-body h-screen flex items-center justify-center">
      <div className="h-auto w-110 bg-white rounded-xl py-10 px-5">
        <div className="text-center">
          <img src={webLogo} className="h-20 w-auto mx-auto" alt="Ora Logo" />
          <h1 className="text-3xl font-semibold text-gray">Welcome Back</h1>
          <p className="text-sm text-skinLight mt-2">Login to your account</p>
        </div>
        
        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleFormSubmit}>
          <div className="flex flex-col space-y-6 mt-8">
            <input
              type="text"
              name="email"
              placeholder="Email or Username"
              value={credentials.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-midGray outline-none text-gray border-mindaro border-1"
              autoComplete="username"
            />
            
            <div className="flex px-4 py-2 rounded-lg border border-mindaro text-skin">
              <input
                type={inputType}
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleInputChange}
                className="w-full outline-none text-skin border-none"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="cursor-pointer flex items-center justify-center"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff className='text-skin'/> : <FiEye className='text-skin'/>}
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <label className="flex items-center text-skin text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2"
                />
                Remember me
              </label>
              
              <Link to="/forget-password" className='text-skin text-right text-sm hover:underline'>
                Forgot password?
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray text-mindaro px-4 py-2 rounded-lg cursor-pointer disabled:opacity-70"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        
        <span className='flex items-center justify-center text-skin gap-2 mt-3 capitalize'>
          Don't have an account?
          <Link to="/register" className='hover:underline'>create account</Link>
        </span>
      </div>
    </div>
  );
};

export default LoginPage;