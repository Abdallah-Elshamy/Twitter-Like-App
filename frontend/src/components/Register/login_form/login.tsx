import { useState} from 'react';
import { useQuery} from '@apollo/client'
import { ApolloClient, createHttpLink, InMemoryCache , gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import {Link ,useHistory} from "react-router-dom"

import "./../../../styles/layout.css";
import "./../Register.css";

import { TweetButton } from "./../../sideBar/tweetButton/tweetButton";
import {Logo} from "./../../logo/logo";
import { parseJwt } from '../../../common/decode';


const LOGIN = gql`
query login($userNameOrEmail: String!, $password: String!) {
    login(userNameOrEmail: $userNameOrEmail, password: $password)  {
      token
    }
  }
`

const token = "LOGOUT"
export function Login()  {
    const [email, setEmail] = useState(' ');
    const [password, setPassword] = useState(' ');
    const routeHistory = useHistory();

    const { data ,loading ,error } = useQuery (LOGIN , {
        variables: { userNameOrEmail: email , password :password },
      });
 
      function submit(){
        if (!loading && !error && data ){
            localStorage.setItem('token', data.login.token );
          }
         
    const httpLink = createHttpLink({
        uri: 'http://localhost:8000/qraphql',
      });
      const token = localStorage.getItem('token');
      const authLink = setContext((_, { headers }) => {
        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : " ",
          } 
    
        }
    
      });
      
      const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache()
      });
    const navigate = (route: string) => routeHistory.push(route)
    if ( data && !loading && !error  && token != "LOGOUT"){
        console.log (parseJwt(token));
        navigate('/')
    }
    if (error ){
        alert ("you have an error" + error ) 
    }
      }

  if (token == "LOGOUT"){
    console.log ( "LOGOUT")
  }


return(
<div>
<Logo />
<div className = "register-container mt-4">
<strong className ="text-4xl font-serif"> Log in to Twitter </strong>

 <div className="flex -mx-3 mt-2">
<div className="w-full px-3">
    <label className="text-xs font-semibold px-1"></label>
    <div className="flex">
        <input  
        type="name"
        name = "email"
        className="w-full h-16 -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-300" 
        placeholder="Email or userName"
        onChange={e => setEmail(e.target.value)}
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
        name = "password"
        className="w-full h-16 -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-300" 
        placeholder="Password"
         onChange={e => setPassword(e.target.value)}
        />
    </div>
</div>
</div> 

    <TweetButton name = "Login" className = "w-80 ml-4" onClick={() =>  email && password &&  submit()}/>


    <div className =" mt-3" >
            <Link to ="/forget_password" className="a_login_form m-8">
             Forget password?
            </Link>

            <Link to ="/signUp" className="a_login_form">
             Sign up for Twitter
            </Link>

            <TweetButton name = "Logout" className ="w-80"
            onClick={() => localStorage.setItem('token',"LOGOUT" )}/>
       
    </div>

   </div>
</div>
  )
}

