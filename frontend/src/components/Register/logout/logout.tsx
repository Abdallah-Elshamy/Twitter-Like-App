import React from 'react';
import { useHistory } from "react-router-dom";
import { useApolloClient } from '@apollo/client'







export function Logout() {
    const history = useHistory()
    const client = useApolloClient()

    async function logoutSubmit() {

        localStorage.clear()
        await client.clearStore()
        console.log("store reseted")
        history.push('/')
    }
    return (
        <div>
            <button className=" mt-1 w-52 text-center block px-4 py-2 text-sm text-gray-700  hover:bg-gray-100 hover:text-gray-900 
         hover:rounded-full rounded-full"  onClick={() => logoutSubmit()}>logout</button>

        </div>
    )
}
