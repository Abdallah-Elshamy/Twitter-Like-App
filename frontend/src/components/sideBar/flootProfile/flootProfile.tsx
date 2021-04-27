import React, {useState, useEffect} from 'react';
import { Logout } from '../../Register/logout/logout';
import { ToolBox } from '../toolbox/toolbox';
import './flootProfile.css';
import { useQuery } from '@apollo/client';
import { parseJwt } from '../../../common/decode';
import { LoggedUser } from '../../../common/queries/Userqery';
import Loading from "../../../UI/Loading"
import  {Get_SFW}  from '../../../common/queries/GET_SFW';
import {SFW} from '../../../common/cache'

export function FlootProfile () {
      var profile;
      if (localStorage.getItem('token') !== null) {
        profile = parseJwt(localStorage.getItem('token'))
      }
    
    
      const [sfw, setsfw] = useState(true)
      const {error, loading ,data} = useQuery(LoggedUser, { variables: { id: profile.id } });

      const handleSFW =()=>{
        (sfw)? setsfw (false): setsfw (true)
      }
      useEffect(() => {
        SFW({value:sfw})
      }, [sfw])
      const data2 = useQuery (Get_SFW).data 

      if (loading) return (<div className="mt-8" ><Loading /></div>)
      if (error) return <p>`Error! ${error.message}`</p>
 

      const userYear:number = (data.user.birthDate).split("-", 1)
      const currentYear = new Date()
      const age = currentYear.getFullYear() - userYear   ; 
      return (

         
        <div>
           <ToolBox className="fixed bottom-0 rounded-full w-60 mt-4 mb-2
           bg-white hover:bg-blue-100 focus:bg-blue-200 focus:outline-none focus:shadow-outline hover:text-gray-900 
           focus:ring-2  focus:ring-offset-gray-100" design={
<div className="flex justify-between items-start p-3">

<div className="person-item-image w-11 h-11  rounded-full  flex-none mr-2 ">
  
 </div>

 <div className="flex-grow pr-20">
   <h3 className=" text-xm font-bold">{(data.user.name).split(" ", 1)}</h3>
   <p className=""><span className="text-xm ">@</span>{data.user.userName}</p>   
 </div>

 <i className=" fas fa-ellipsis-h"></i>
</div>
           }>

          <ul className= "px-4 mt-16" >
          <a href="/profile" className="mt-1 w-52 text-center block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 
          hover:text-gray-900  hover:rounded-full rounded-full" role="menuitem">My Account</a>

          {
            (age > 18) &&
            <button className="mt-1 w-52 text-center block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 
            hover:text-gray-900  hover:rounded-full rounded-full focus:outline-none" role="menuitem" 
            onClick={handleSFW}>{(sfw)?'Set NSFW':'Set SFW'}</button>
          }
          <Logout/>
            </ul>

  </ToolBox>
  </div>
              


      );
    }
