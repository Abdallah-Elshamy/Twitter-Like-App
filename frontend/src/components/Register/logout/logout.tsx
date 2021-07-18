import React from 'react';
import { useHistory } from "react-router-dom";
import { useApolloClient } from '@apollo/client'
import { changeSubscriptionToken } from "../../../common/apolloClient"
import {NewTweetsCount} from "../../../common/cache"






export function Logout() {
    const history = useHistory()
    const client = useApolloClient()

    async function logoutSubmit() {

        localStorage.clear()
        await client.clearStore()
        changeSubscriptionToken(null)
        NewTweetsCount({ value: 0 })
        history.push('/')
    }
    return (
        <div>
            <button className="bg-white  mt-1 w-28 text-center block px-4 py-2 m-auto text-sm text-gray-700  hover:bg-red-200  hover:text-gray-900 
         hover:rounded-full rounded-full"  onClick={() => logoutSubmit()}>logout</button>
        </div>
    )
}
