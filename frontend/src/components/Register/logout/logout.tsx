import React from 'react';
import {Link} from "react-router-dom"




function logoutSubmit (){
    localStorage.setItem('token',"LOGOUT");
}

export function Logout () {
    return(
        <div>
        <Link to ="/login" className=" mt-1 w-52 text-center block px-4 py-2 text-sm text-gray-700  hover:bg-gray-100 hover:text-gray-900 
         hover:rounded-full rounded-full"  onClick={() => logoutSubmit ()} >logout </Link>
    
    </div>
    )
}
