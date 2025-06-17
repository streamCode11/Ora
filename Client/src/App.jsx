import Loader from './components/common/Loader'
import Navbar from './components/common/Navbar'
import Sidebar from './components/common/Sidebar'
import './styles/main.css'
function App() {
  return(
    <div className='bg-white'>
    <Navbar/>
    <Sidebar/>
    </div>
  )
}

export default App
