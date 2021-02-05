import React , { Component } from 'react';

interface name_Item {
    placeholder : string 
    name? : string ,
    onChange? : any ,
    type? : string 
}

export class FormInput extends Component<name_Item>{
render() {
  return ( 

       <div className="flex -mx-3 mt-2">
            <div className="w-full px-3">
                <label className="text-xs font-semibold px-1"></label>
                <div className="flex">
                    <input  
                    type={ this.props.type}
                    name = { this.props.name}
                    className="w-full h-16 -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-300" 
                    placeholder={ this.props.placeholder}
                    />
                </div>
            </div>
        </div>

);
}
}
