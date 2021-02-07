import React from 'react';
import "./../../../styles/layout.css";
import "./../Register.css";

import { TweetButton } from "./../../sideBar/tweetButton/tweetButton";
import {Logo} from "./../../logo/logo";
import { FormInput } from "./../formInput/formInput"
import {Link} from "react-router-dom"


interface Props {

}

export const Login : React.FC <Props> = () =>  (
<div>
<Logo />
<div className = "register-container mt-4">
<strong className ="text-4xl font-serif"> Log in to Twitter </strong>

    <FormInput placeholder  = "Email" />
    <FormInput placeholder  = "password" />
    <TweetButton name = "Login" className = "w-80"/>


    <div className =" mt-3" >

        <b>
            <Link to ="/forget_password">
            <a className="a_login_form m-4"> Forget password?  </a>
            </Link>
            </b>
        <b>
            <Link to ="/signUp">
            <a className="a_login_form m-4 ">   Sign up for Twitter</a>
            </Link>
            </b>
    </div>

   </div>
</div>
)

