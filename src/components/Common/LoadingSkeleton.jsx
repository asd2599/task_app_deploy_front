import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingSkeleton = () => {
  return (
    <div className="w-1/3 flex flex-col p-4 justify-between">
      <div>
        <Skeleton height="30px" width="40%" />
      </div>
      <div>
        <Skeleton height="30px" width="100%" />
        <Skeleton height="30px" width="100%" />
        <Skeleton height="30px" width="100%" />
        <Skeleton height="30px" width="100%" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
