import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/dashboard/HomePage'
import './styles/main.css'
import LoginPage from './pages/auth/LoginPage'

function App() {
  return(
    
    <Routes>
      <Route path='/login' element={<LoginPage/>}/>
      <Route index element={<HomePage/>}/>
    </Routes>
  )
}

export default App
