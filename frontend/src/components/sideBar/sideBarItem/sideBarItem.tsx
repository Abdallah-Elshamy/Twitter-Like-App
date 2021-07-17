import React, { Component } from 'react'
import './sideBarItem'
import './item.css';
import  {
  useLocation
} from "react-router-dom";


interface SideBar_Item {
  item_name?: string,
  icon_name: string,
  countUnseen?: number
}

export function SideBarItem  (props:any){
console.log ("ifActive", props.className)


    return (

      // <div className="flex">
      <div className="flex-initial ... ">
        <nav className="md:pb-0 md:overflow-y-auto mt-2">
          <div>

            <button className=" lg:mx-2 p-1 lg:p-3 mt-6  font-semibold lg:mt-0 not-italic hover:text-gray-900 rounded-full bg-white 
              text-black focus:ring-offset-gray-100  hover:bg-blue-100 focus:bg-blue-100 focus:outline-none focus:text-blue-500 
              hover:rounded-full focus:shadow-outline-none align-middle items-center ">
              {props.countUnseen ? <b className="text-xs bg-blue-400 rounded-full py-2 mb-2 text-white p-1 mr-1">{props.countUnseen}
                <i className={`px-1 ${props.icon_name}`} ></i>
              </b>
                : <i className={`lg:mr-2 mt-1  px-2 text-lg ${props.icon_name}  ${props.className}` } ></i>}
              <b className={`font-semibold text-right text-xl hidden lg:inline-block ${props.className}`}> {props.item_name} </b>
            </button>

          </div>
        </nav>
      </div>
      // </div>
    );

  }

