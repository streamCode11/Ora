import { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
    refreshToken: "",
  });
  useEffect(() => {
    const authUser = localStorage.getItem("auth");
    setAuth(JSON.parse(authUser));
  }, []);

  

     return (
     <AuthContext.Provider value={[auth, setAuth]}>
          {children}
     </AuthContext.Provider>
     );
};

const useAuth = () => useContext(AuthContext);
export { useAuth, AuthProvider };
