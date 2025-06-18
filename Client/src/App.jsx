import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/dashboard/HomePage'
import './styles/main.css'

function App() {
  return(
    
    <Routes>
      <Route index element={<HomePage/>}/>
    </Routes>
  )
}

export default App
