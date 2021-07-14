import React, { Component } from 'react'
import './sideBarItem'

interface SideBar_Item {
  item_name?: string,
  icon_name: string,
  countUnseen?: number
}

export class SideBarItem extends Component<SideBar_Item>{
  render() {
    return (

      // <div className="flex">
      <div className="flex-initial ... ">
        <nav className="md:pb-0 md:overflow-y-auto mt-2">
          <div>

            <button className=" lg:mx-12 py-3 mt-3 font-semibold md:mt-0 not-italic hover:text-gray-900 rounded-full bg-white 
              text-black focus:ring-offset-gray-100  hover:bg-blue-100 focus:bg-blue-100 focus:outline-none focus:text-blue-500 
              hover:rounded-full focus:shadow-outline-none align-middle items-center ">
              {this.props.countUnseen ? <b className="text-xs bg-blue-400 rounded-full py-2 mb-2 text-white p-1 mr-1">{this.props.countUnseen}
                <i className={`px-1 ${this.props.icon_name}`} ></i>
              </b>
                : <i className={`mr-2 px-2 text-lg ${this.props.icon_name}`} ></i>}
              <b className=" font-semibold text-right text-xl hidden lg:inline-block"> {this.props.item_name} </b>
            </button>

          </div>
        </nav>
      </div>
      // </div>
    );

  }
}
