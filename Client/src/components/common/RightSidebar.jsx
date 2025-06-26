import React from "react";
import Suggestion from "./Suggestion";
import TrendingTopic from "./TrendingTopic";

const RightSidebar = () => {
  return (
    <div className="fixed top-20 right-0 h-screen w-100  shadow-lg p-4 overflow-y-auto">
      <Suggestion />
      <TrendingTopic />
    </div>
  );
};

export default RightSidebar;
