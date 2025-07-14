import React , {useState , useEffect} from 'react'
import Sidebar from '../../components/common/Sidebar'
import Navbar from '../../components/common/Navbar'
import RightSidebar from '../../components/common/RightSidebar'
import FeedPage from './FeedPage'


const HomePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const user = JSON.parse(localStorage.getItem("auth"));
      setCurrentUser(user.data);
    };
    fetchUser();
  }, []);

  const updateCurrentUser = (updatedUser) => {
    setCurrentUser(updatedUser);
  };
  return (
    <>
     <Navbar/>
     <FeedPage 
      currentUser={currentUser} 
      updateCurrentUser={updateCurrentUser} 
    />
     <RightSidebar/>
    </>
  )
}

export default HomePage
