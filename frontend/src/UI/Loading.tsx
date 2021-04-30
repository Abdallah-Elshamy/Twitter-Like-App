import React from 'react';
import { HashLoader } from 'react-spinners';
import { LengthType } from 'react-spinners/interfaces';

const Loading: React.FC<{ size?: LengthType }> = ({ size }) => {

  return (<div className="w-full grid justify-center items-center h-1/2">
    <HashLoader color={'#ccc'} loading={true} size={size || 50} />
  </div>)
}
export default Loading