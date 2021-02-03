import React from 'react';
import "./../Register.css";

import { TweetButton } from "./../../sideBar/tweetButton/tweetButton";
import {Logo} from "./../../logo/logo";
import { FormInput } from "./../formInput/formInput";

export const SignUpForm : React.FC  = () =>  (
<div>
<Logo />
<div className = "register-container">
<strong className ="text-4xl font-serif mt-4"> Create your account </strong>



    <FormInput label_name = "Email" />
    <FormInput label_name = "password" />

    <div className = " mt-8 text-left" >
        <strong className = "text-2xl font-serif mr-16"> Date of birth </strong>
        <p      className = "text-1xl font-serif pr-4 text-gray-500"> This will not be shown publicly. Confirm your own age. </p>
    </div>

        <TweetButton name = "Next" className = "w-80"/>
    <div className ="pl-24" >
        <b><a href="#" target="_blank" className="a_login_form mt-12"> Aready have account ? </a></b>
    </div>

   </div>
</div>
)