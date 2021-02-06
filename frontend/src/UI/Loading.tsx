import React from 'react';
import Loader from "react-loader-spinner"

const Loading: React.FC = () => {

  return (<div className="w-full flex justify-center items-center h-1/2">
    <Loader type="TailSpin" color="lightgray" width="60" height="60" />
  </div>)
}
export default Loading