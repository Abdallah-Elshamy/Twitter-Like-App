import React , { useState } from 'react';
import "./../Register.css";
import { TweetButton } from "./../../sideBar/tweetButton/tweetButton";
import {Logo} from "./../../logo/logo";
import { FormInput } from "./../formInput/formInput";
import { useMutation, gql} from '@apollo/client';



//create user take userInput then return user
// const ADD_USER = gql`
//  mutation AddUser (
//   $name: String!,
//   $email: String! ,
//   $password: String!,
//   $userName: String!
// ) {
//     createUser(userInput :{
//     name: $name,
//     userName: $userName,
//     email : $email,
//     password : $password
//   }) {
//       id
//       userName
//       email
//     }
//   }
// `;

const ADD_USER = gql`
mutation createUser ($userInput: UserCreateInput!) {
  createUser(userInput : $userInput) {
    name
    userName
    id
    email
    bio
    createdAt 
  }
}
`;

interface User {
  id : string ,
  name: String,
  email: String ,
  password: String,
  userName: String
}

interface New_User {
  name: String,
  email: String ,
  password: String,
  userName: String
}


export function SignUpForm () {
  const [name, setName] = useState('');
  const [userName, setUserName] = useState(' ');
  const [email, setEmail] = useState(' ');
  const [password, setPassword] = useState(' ');

  const [createUser ,  { error, data }] = useMutation<{createUser :User } ,{ userInput  : New_User} >(ADD_USER,{
    variables: { userInput : { userName , email , password , name } }
  });

return(
  <div>
    <Logo />

<div className = "register-container">
  
<strong className ="text-4xl font-serif mt-4 -ml-8"> Create your account </strong>
      {error ? <p>Oh no! {error.message}</p> : null}
      {data && data.createUser ? <p>Saved!</p> : null}
      

     <form>



        <div className="flex -mx-3 mt-2">
            <div className="w-full px-3">
                <label className="text-xs font-semibold px-1"></label>
                <div className="flex">
                <input
            type="email"
            name="email"
            onChange={e => setEmail(e.target.value)}
            className="w-full h-16 -ml-20 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-300"  
            placeholder = "Email"
          />
                </div>
            </div>
        </div>

        <div className="flex -mx-3 mt-2">
            <div className="w-full px-3">
                <label className="text-xs font-semibold px-1"></label>
                <div className="flex">
                <input
            type="password"
            name="password"
            onChange={e => setPassword(e.target.value)}
            className="w-full h-16 -ml-20 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-300" 
            placeholder = "Password"
          />
                </div>
            </div>
        </div>

        <div className = "flex">
     <div className="flex -mx-3 mt-2">
            <div className="w-full px-3">
                <div className="flex">
                <input
                  type = "name"
                  name="name"
                  onChange={e => setName(e.target.value)}
                  className="h-16 max-w-3xl -ml-20  rounded-lg border-2 border-gray-200 outline-none focus:border-blue-300 mt-6 pl-8 mr-10" 
                  placeholder = "Name"
                />
                </div>
            </div>
        </div>

                    

        <div className="flex -mx-3 mt-2">
            <div className="w-full px-3">
                <div className="flex">
                <input
            type="name"
            name="userName"
            onChange={e => setUserName(e.target.value)}
            className="h-16 max-w-3xl  rounded-lg border-2 border-gray-200 outline-none focus:border-blue-300 mt-6 pl-8 mr-20" 
            placeholder = "User name"
          />
                </div>
            </div>
        </div>
                  </div>
    <div className = " mt-8 text-left -ml-8" >
        <strong className = "text-2xl font-serif mr-16"> Date of birth </strong>
        <p      className = "text-1xl font-serif pr-4 text-gray-500"> This will not be shown publicly. Confirm your own age. </p>
    </div>



       <TweetButton name = "Next" className ="w-80" onClick={() => name && userName && email && password && createUser()} />
      <div className ="pl-24" >
          <b><a href="#" target="_blank" className="a_login_form mt-12"> Aready have account ? </a></b>
      </div>
      </form>
    </div>

    </div>
  );
}
