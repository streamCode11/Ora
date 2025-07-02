import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import webLogo from '../../assets/Ora bg.png';
import axios from 'axios';
import Apis from '../../config/apis';
import { useAuth } from '../../context/auth';

const LoginPage = () => {
  const [inputType, setInputType] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [username , setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [auth, setAuth] = useAuth(); 
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setInputType(showPassword ? 'password' : 'text');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${Apis.auth}/login`, { 
        email, 
        password 
      });
      
      if (response.data.error) {
        setError(response.data.error);
        alert(response.data.error);
      } else {

        localStorage.setItem('auth', JSON.stringify(response.data));
        setAuth(response.data);
        
        alert('Login successful!');
        navigate('/home');
      }
    } catch (err) {
      console.log('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-body h-screen flex items-center justify-center">
      <div className="h-auto w-110 bg-gray rounded-xl py-10 px-5">
        <div className="text-center">
          <img src={webLogo} className="h-20 w-auto mx-auto" alt="Ora Logo" />
          <h1 className="text-3xl font-semibold text-skin">Welcome Back</h1>
          <p className="text-sm text-skinLight mt-2">Login to your account</p>
        </div>
        
        <form onSubmit={handleFormSubmit}>
          <div className="flex flex-col space-y-6 mt-8">
            <input
              type="text"
              placeholder="Email or Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-midGray outline-none text-skin border-none"
              required
            />
            
            <div className="flex px-4 py-2 rounded-lg bg-midGray outline-none text-skin">
              <input
                type={inputType}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none text-skin border-none"
                required
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
              className="w-full bg-skin text-gray px-4 py-2 rounded-lg hover:bg-skinDark transition-colors cursor-pointer disabled:opacity-70"
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