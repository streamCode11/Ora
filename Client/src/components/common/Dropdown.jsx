import { FiHome , FiCompass, FiSettings , FiX , FiUser } from "react-icons/fi";
import { RiMessengerLine } from "react-icons/ri";
import { Link } from "react-router-dom";

const Dropdown = ({closeDrop}) => {
     const linkName = [
         { id: 0, name: "home", to: "/home"  , icon:<FiHome/>},
         { id: 1, name: "Profile", to: "/profile"  , icon:<FiUser/>},
         { id: 2, name: "explore", to: "/explore" , icon:<FiCompass/>},
         { id: 3, name: "messages", to: "/message"  , icon:<RiMessengerLine/>},
         { id: 4, name: "setting", to: "/setting" , icon:<FiSettings/> },
       ];
  return (
    <div className='w-70 h-auto bg-white absolute top-21 right-7 py-2 px-3 flex-col flex gap-2 rounded-lg '>
     <div className="text-2xl cursor-pointer text-grey" onClick={closeDrop} >
          <FiX/>
     </div>
     <div className="flex flex-col  gap-1">

      {
          linkName.map((link, index) =>(
          <Link to={link.to} >
               <div className="flex items-center gap-3 h-15 hover:bg-body px-3 rounded-lg cursor-pointer transition-all " key={index}>
                    <span className="text-2xl">{link.icon}</span>
                    <span className="text-[16px] capitalize tracking-wide">{link.name}</span>
               </div>
          </Link>
          ))
      }
     </div>
    </div>
  )
}

export default Dropdown
