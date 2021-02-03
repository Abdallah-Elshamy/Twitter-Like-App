import React, { Component } from 'react'
import './sideBarItem'

interface SideBar_Item {
    item_name?: string ,
    icon_name : string
}

export class SideBarItem extends Component<SideBar_Item>{
render() {
  return ( 
  
<div className = "flex">
  <div className = "flex-initial ...">
    <nav  className="md:pb-0 md:overflow-y-auto mt-2">

      <div>
        <button className="block p-3 py-2 mt-3 font-semibold rounded-lg md:mt-0 not-italic hover:text-gray-900 rounded-full bg-white text-black
            focus:ring-offset-gray-100 bg-white hover:bg-blue-100 hover:rounded-full focus:bg-blue-100 focus:outline-none focus:text-blue-500 
            hover:rounded-full focus:shadow-outline-none align-middle items-center order-1 transition">
            <i className =  {`mr-2 px-2 text-lg ${this.props.icon_name}`} ></i>
              <b className =" font-semibold text-right text-xl"> { this.props.item_name } </b>
          </button>

      </div>

    </nav>
 </div>
</div>
  );
}
}
