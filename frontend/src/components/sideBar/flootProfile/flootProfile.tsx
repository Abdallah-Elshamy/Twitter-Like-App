import React from 'react';
import { Logout } from '../../Register/logout/logout';
import { ToolBox } from '../toolbox/toolbox';
import './flootProfile.css';



interface IRecipeProps {
  ingredients?: string[];
  title?: string;
  className?: string;
  instructions?: string;
}

export class FlootProfile extends React.Component<IRecipeProps> {


    render() {


      return (

         
        <div>
           <ToolBox className="fixed bottom-0 rounded-full w-60 mt-4 mb-2
           bg-white hover:bg-blue-100 focus:bg-blue-200 focus:outline-none focus:shadow-outline hover:text-gray-900 
           focus:ring-2  focus:ring-offset-gray-100" >
          <ul className= "px-4 mt-40" >
          <a href="/profile" className="mt-1 w-52 text-center block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 
          hover:text-gray-900  hover:rounded-full rounded-full" role="menuitem">My Account</a>

          <Logout/>


          </ul>


  </ToolBox>
  {/* <div className="flex justify-between items-start p-3">

<div className="person-item-image w-11 h-11  rounded-full  flex-none mr-2 ">
  
 </div>

 <div className="flex-grow pr-20">
   <h1 className=" text-xm font-bold">eslam</h1>
   <p className=""><span className="text-xm ">@</span>eslam</p>
   
 </div>

 <i className=" fas fa-ellipsis-h"></i>
</div>   */}
  </div>
              


      );
    }
  }