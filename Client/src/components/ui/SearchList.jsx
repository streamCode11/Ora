import React, { useState, useEffect } from "react";
import axios from "axios";
import Apis from "../../config/apis";
import { Link, useNavigate, useParams } from "react-router-dom";

const SearchList = ({ searchTerm, onClose }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const getCurrentUser = () => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    return authData?.user || null;
  };

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchTerm || searchTerm.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${Apis.base}/auth/search`, {
          params: { query: searchTerm }
        });
        setResults(response.data.users || []);
      } catch (err) {
        console.error("Search error:", err);
        setError(err.response?.data?.message || err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  

  return (
    <div className="absolute left-0 top-20 mx-3 w-[calc(100vw-24px)] z-10 lg:top-23 lg:w-103 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto">
      {loading ? (
        <div className="p-4 flex justify-center items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-mindaro"></div>
        </div>
      ) : error ? (
        <div className="p-3 text-red-500 bg-red-300 text-sm">{error}</div>
      ) : results.length > 0 ? (
        <ul className="divide-y divide-gray-100">
          {results.map((user) => (
            <li
              key={user._id}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <Link
                to={
                  getCurrentUser()?.id === user._id
                    ? "/profile"
                    : `/profile/${user._id}`
                }
                className="p-3 flex items-center"
              >
                <img
                  src={user.profileImg || "/default-profile.png"}
                  alt={user.username}
                  className="h-10 w-10 rounded-full object-cover mr-3"
                  onError={(e) => {
                    e.target.src = "/default-profile.png";
                  }}
                />
                <div>
                  <p className="font-medium text-gray-900">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.fullName}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        searchTerm && (
          <div className="p-4 text-center text-gray-500">
            No users found for "{searchTerm}"
          </div>
        )
      )}
    </div>
  );
};

export default SearchList;