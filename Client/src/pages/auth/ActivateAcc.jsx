import React, { useState, useEffect } from "react";
import { useParams, useNavigate , Link } from "react-router-dom";
import apis from "../../config/apis";
import axios from "axios";
import webLogo from '../../assets/Ora bg.png';
import LoaderCom from "../../components/common/Loader";


const ActivateAccount = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const activateAccount = async () => {
    try {
      const { data } = await axios.post(`${apis.auth}/signup`, { token });
      const { ok, message , error } = data;
      if (data.error) {
        setError(data.error);
      } else {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 
               err.message || 
               "Activation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      activateAccount();
    } else {
      setError("Invalid activation link");
      setLoading(false);
    }
  }, [token]);

  return (
    <div className="bg-body h-screen flex items-center justify-center">
      <div className="h-auto w-110 bg-gray rounded-xl py-10 px-5 text-center">
        <img src={webLogo} className="h-20 w-auto mx-auto mb-4" alt="Ora Logo" />
        
        {loading ? (
          <div className="flex flex-col items-center">
          <LoaderCom/>
            <p className="mt-4 text-skin">Activating your account...</p>
          </div>
        ) : error ? (
          <div className="text-skin">
            <h2 className="text-2xl font-semibold mb-2">Activation Failed</h2>
            <p className="text-red-400 mb-4">{error}</p>
            <Link 
              to="/register" 
              className="text-skin underline hover:text-skinDark"
            >
              Try registering again
            </Link>
          </div>
        ) : success ? (
          <div className="text-skin">
            <h2 className="text-2xl font-semibold mb-2">Account Activated!</h2>
            <p className="mb-4">Your account has been successfully activated.</p>
            <p>You will be redirected to login shortly...</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ActivateAccount;