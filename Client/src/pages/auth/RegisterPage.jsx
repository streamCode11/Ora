import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiEyeOff, FiUpload, FiX } from 'react-icons/fi';
import axios from 'axios';
import Apis from '../../config/apis';
import webLogo from '../../assets/Ora bg.png';

const Register = () => {
  // Form state
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [inputType, setInputType] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [profileImg, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const fileInputRef = useRef(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setInputType(showPassword ? 'password' : 'text');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setError('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      if (file.size > 4 * 2048 * 2048) {
        setError('Image size should be less than' );
        return;
      }
      
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setError(''); 
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setPreviewImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!fullName || !username || !email || !password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }
    
    try {
     

      const { data } = await axios.post(`${Apis.auth}/pre-signup`,  {
          fullName , 
          username,
          email , 
          password ,
      });
      
      if (data.error) {
        setError(data.error);
      } else {
        setRegistrationSuccess(true);
        setEmail('');
        setUsername('');
        setFullName('');
        setPassword('');
        setProfileImage(null);
        setPreviewImage('');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-body min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl py-8 px-6 ">
        <div className="text-center mb-6">
          <img src={webLogo} className="h-20 w-auto mx-auto" alt="Ora Logo" />
          <h1 className="text-3xl font-semibold text-skin mt-4">Create Account</h1>
          <p className="text-sm text-skinLight mt-2">Join our community</p>
        </div>
        
        {!registrationSuccess ? (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div >
              <label htmlFor="fullName" className="block text-sm font-medium text-skin mb-1">
                Full Name 
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg  outline-none border-mindaro border text-gray "
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-skin mb-1">
                Username 
              </label>
              <input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg  outline-none border-mindaro border text-gray "
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-skin mb-1">
                Email 
              </label>
              <input
                id="email"
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg  outline-none border-mindaro border text-gray "
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-skin mb-1">
                Password 
              </label>
              <div className="w-full px-4 flex gap-3 py-2 rounded-lg  outline-none border-mindaro border text-gray ">
                <input
                  id="password"
                  type={inputType}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full outline-none text-skin border-none bg-transparent"
                />
                <button
                  type="button"
                  className="ml-2 text-skin hover:text-skinDark transition-colors"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-midGray border-gray-300 text-skin focus:ring-skin"
                />
                <span className="text-sm text-skin">Remember me</span>
              </label>
              
              <Link to="/login" className="text-sm text-skin hover:underline">
                Already have an account?
              </Link>
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray text-mindaro px-4 py-3 rounded-lg hover:bg-skinDark transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center font-medium"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
        ) : (
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">Registration Successful!</h3>
            <p className="text-green-700 mb-4">
              We've sent an activation link to your email. Please check your inbox and click the link to activate your account.
            </p>
            <p className="text-sm text-green-600">
              Didn't receive the email?{' '}
              <button 
                onClick={handleFormSubmit}
                className="font-medium hover:underline focus:outline-none"
              >
                Resend activation email
              </button>
            </p>
            <Link 
              to="/login" 
              className="inline-block mt-4 px-4 py-2 bg-skin text-gray rounded-lg hover:bg-skinDark transition-colors"
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;