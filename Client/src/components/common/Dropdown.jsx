import { FiHome, FiCompass, FiSettings, FiX, FiUser } from "react-icons/fi";
import { RiMessengerLine } from "react-icons/ri";
import { Link } from "react-router-dom";

const Dropdown = ({ closeDrop }) => {
  const menuItems = [
    { id: 0, name: "Home", to: "/home", icon: <FiHome /> },
    { id: 1, name: "Profile", to: "/profile", icon: <FiUser /> },
    { id: 2, name: "Explore", to: "/explore", icon: <FiCompass /> },
    { id: 3, name: "Messages", to: "/message", icon: <RiMessengerLine /> },
    { id: 4, name: "Settings", to: "/setting", icon: <FiSettings /> },
  ];

  return (
    <div className="absolute top-16 right-3 w-56 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden animate-fadeIn">
      <div className="flex justify-end p-2">
        <button 
          onClick={closeDrop}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          aria-label="Close menu"
        >
          <FiX className="text-xl" />
        </button>
      </div>

      <nav className="pb-1">
        {menuItems.map((item) => (
          <Link
            to={item.to}
            key={item.id}
            onClick={closeDrop}
            className="block transition-colors hover:bg-gray-50 active:bg-gray-100"
          >
            <div className="flex items-center px-4 py-3 space-x-3">
              <span className="text-gray-600 text-lg">{item.icon}</span>
              <span className="text-gray-800 font-medium">{item.name}</span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Dropdown;