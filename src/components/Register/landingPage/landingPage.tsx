import React from 'react';
import { TweetButton } from "./../../sideBar/tweetButton/tweetButton";
import { FormInput } from "./../formInput/formInput"

interface Props {

}

export const LandingPage : React.FC <Props> = () =>  (

    <div className = "flex flex-initial">

                <div className="flex -mx-3">
                    <div className="w-1/2 px-3 mb-5">
                        <label className="text-xs font-semibold text-3xl px-3 mb-3">Email</label>
                        <div className="flex">
                            <input type="text" className=" w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"/>
                        </div>
                    </div>



                    <div className="w-1/2 px-3 mb-5">
                        <label  className="text-xs font-semibold text-3xl px-1">Passward</label>
                        <div className="flex">
                            <input type="text" className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"/>
                        </div>
                    </div>
                 </div>

                    <div className="mb-10 mt-10">
                        <h1 className="font-bold text-3xl text-gray-900">Join twitter today.</h1>   
                    </div>


                    <div className="flex">
                        <div className="w-full mt-2">

                            <TweetButton name = "SignUp" className ="w-80"/>
                            <TweetButton name = "Login" className ="w-80"/>

                        </div>
                    </div>

     </div>


)
