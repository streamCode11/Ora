const UserList = ({ title, users, action, actionText, selectedUser }) => {
     return (
       <div className="mb-6">
         <h3 className="font-semibold text-lg mb-2">{title}</h3>
         <ul className="space-y-2">
           {users.map(user => (
             <li 
               key={user} 
               className={`flex justify-between items-center p-2 rounded ${
                 selectedUser === user ? 'bg-gray-300' : 'hover:bg-gray-300'
               }`}
             >
               <span>{user}</span>
               {action && (
                 <button 
                   onClick={() => action(user)}
                   className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                 >
                   {actionText}
                 </button>
               )}
             </li>
           ))}
         </ul>
       </div>
     );
   };
   
   export default UserList;