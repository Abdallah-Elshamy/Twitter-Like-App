import React from 'react';
import "./../../../styles/layout.css";
import "./../Register.css";

import { TweetButton } from "./../../sideBar/tweetButton/tweetButton";
import {Logo} from "./../../logo/logo";
import { FormInput } from "./../formInput/formInput"

interface Props {

}

export const Login : React.FC <Props> = () =>  (
<div>
<Logo />
<div className = "register-container mt-4">
<strong className ="text-4xl font-serif"> Log in to Twitter </strong>

    <FormInput label_name = "Email" />
    <FormInput label_name = "password" />
    <TweetButton name = "Login" className = "w-80"/>


    <div className =" mt-3" >

        <b><a href="#" target="_blank" className="a_login_form m-4"> Forget password?  </a></b>
        <b><a href="#" target="_blank" className="a_login_form m-4 ">   Sign up for Twitter</a></b>
    </div>

   </div>
</div>
)