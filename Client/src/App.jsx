import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/dashboard/HomePage'
import './styles/main.css'
import LoginPage from './pages/auth/LoginPage'
import MainRoutes from './Routes/MainRoutes'

function App() {
  return(
      <MainRoutes/>
  )
}

export default App
