const RequestList = ({ requests, onAccept, onReject }) => {
     if (requests.length === 0) return null;
   
     return (
       <div className="mb-6">
         <h3 className="font-semibold text-lg mb-2">Pending Requests</h3>
         <ul className="space-y-2">
           {requests.map(user => (
             <li key={user} className="flex justify-between items-center p-2 rounded hover:bg-gray-300">
               <span>{user}</span>
               <div className="space-x-2">
                 <button 
                   onClick={() => onAccept(user)}
                   className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                 >
                   Accept
                 </button>
                 <button 
                   onClick={() => onReject(user)}
                   className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                 >
                   Reject
                 </button>
               </div>
             </li>
           ))}
         </ul>
       </div>
     );
   };
   
   export default RequestList;