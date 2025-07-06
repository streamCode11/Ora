import { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
    refreshToken: "",
    loading: true  
  });

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const authData = localStorage.getItem("auth");
        if (authData) {
          setAuth({
            ...JSON.parse(authData),
            loading: false
          });
        } else {
          setAuth(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setAuth(prev => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };