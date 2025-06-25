import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/main.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/auth.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <Router>
      <App />
    </Router>
  </AuthProvider>
);
