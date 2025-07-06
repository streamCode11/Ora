import React from 'react'

const TrendingTopic = () => {
  return (
     <div className=" mt-4 mb-6 w-85 min-h-30 max-h-auto bg-gray rounded-lg py-4 px-3">
     <h2 className="text-mindaro text-xl capitalize" >Trending Topics</h2>
     <ul className="list-decimal pl-7 text-white flex flex-col space-y-2 mt-4">
       <li className="mb-2">#JavaScript</li>
       <li className="mb-2">#ReactJS</li>
       <li className="mb-2">#WebDevelopment</li>
       <li className="mb-2">#CSS</li>
       <li className="mb-2">#NodeJS</li>
     </ul>
   </div>
  )
}

export default TrendingTopic
