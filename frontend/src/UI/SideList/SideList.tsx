import React from 'react';
import {Link} from 'react-router-dom'

import './SideList.css'

type Props = {
title:string,
redirect:string,
}
const SideList: React.FC<Props> = ({title,redirect,children}) => {


  return (
    <div className="sidelist mb-2 mt-4 rounded-xl  py-3 felx flex-col">
      <h1 className="sidelist-title font-bold text-base mx-4 mb-2">{title}</h1>
      {children}
      <Link className="sidelist-redirect w-full block px-3 pt-3  " to={redirect} >Show more...</Link>
      
    </div>
  )
}
export default SideList;
