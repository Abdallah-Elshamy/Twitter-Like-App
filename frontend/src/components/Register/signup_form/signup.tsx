import React , { FormEvent, useState } from 'react';
import {Link} from "react-router-dom";
import { useMutation } from '@apollo/client';

import "./../Register.css";

import { TweetButton } from "./../../sideBar/tweetButton/tweetButton";
import {Logo} from "./../../logo/logo";
import { FormInput } from "./../formInput/formInput";
import { ADD_USER } from '../../../common/queries/createUser';
import { New_User, User } from '../../../interface/signUp';

export function SignUpForm () {

//set state to catch changes in form 
  const [name, setName] = useState('');
  const [userName, setUserName] = useState(' ');
  const [email, setEmail] = useState(' ');
  const [password, setPassword] = useState(' ');
  const [birthDate , setBirthDate ] = useState (' ')


  const [createUser , { error, data }] = useMutation<{createUser :User} ,{ userInput  : New_User} >(ADD_USER,{
    variables: { userInput : { userName , email , password , name , birthDate } }
  });

return(
  <div>
    <Logo />

<div className = "register-container">
  
<strong className ="text-4xl font-serif mt-4 -ml-8"> Create your account </strong>
      {error ? <p> Oh no! {error.message}</p> : null}
      {data && data.createUser ? <p></p> : null}
      

     <form>
        <FormInput 
                   type="email"
                   name="email"
                   onChange={($e: FormEvent<HTMLInputElement>) => setEmail($e.currentTarget.value)}
                   className="w-full h-16 -ml-20 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-300"  
                   placeholder = "Email"
                 />

        <FormInput           
            type="password"
            name="password"
            onChange={($e: FormEvent<HTMLInputElement>) => setPassword($e.currentTarget.value)}
            className="w-full h-16 -ml-20 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-300" 
            placeholder = "Password"
          />


  <div className = "flex">
        <FormInput 
              type ="name"
              name="name"
              onChange={($e: FormEvent<HTMLInputElement>) => setName($e.currentTarget.value)}
              className="h-16 max-w-3xl -ml-20  rounded-lg border-2 border-gray-200 outline-none focus:border-blue-300 mt-6 pl-8 mr-10" 
              placeholder = "Name"
            />       
        <FormInput 
                   type="name"
                   name="userName"
                   onChange={($e: FormEvent<HTMLInputElement>) => setUserName($e.currentTarget.value)}
                   className="h-16 max-w-3xl  rounded-lg border-2 border-gray-200 outline-none focus:border-blue-300 mt-6 pl-8 mr-20" 
                   placeholder = "User name"
                 />
       </div>

       
       
    <div className = " mt-8 text-left -ml-8" >
        <strong className = "text-2xl font-serif mr-16"> Date of birth </strong>
        <p      className = "text-1xl font-serif pr-4 text-gray-500"> This will not be shown publicly. Confirm your own age. </p>
    </div>

      <FormInput 
            type = "name"
            name="name"
            onChange={($e: FormEvent<HTMLInputElement>) => setBirthDate($e.currentTarget.value)}
            className="w-full h-16 -ml-20 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-300" 
            placeholder = "2011-01-01"
          />

      <Link to ="/login">
       <TweetButton name = "Next" className ="w-80" onClick={() => name && userName && email && password && birthDate && createUser()} />
       </Link>
    
      <div className ="pl-24" >
           <Link to ="/login" className="a_login_form mt-12">
             Aready have account?
            </Link >
      </div>


      </form>
      
    </div>

    </div>
  );
}
