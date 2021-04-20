import React, { FormEvent, useState } from 'react';
import { useQuery } from '@apollo/client'
import { ApolloClient, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Link, useHistory } from "react-router-dom"

import "./../../../styles/layout.css";
import "./../Register.css";

import { TweetButton } from "./../../sideBar/tweetButton/tweetButton";
import { Logo } from "./../../logo/logo";
import { FormInput } from '../formInput/formInput';
import { LOGIN } from '../../../common/queries/login_query';
import { authenticatedVal, cache } from '../../../common/cache';
import { withApollo } from '@apollo/react-hoc';

const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql',
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

export const clientLog = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: cache
});


export function Login() {
  const [email, setEmail] = useState(' ');
  const [password, setPassword] = useState(' ');
  const routeHistory = useHistory();

  const { data, loading, error } = useQuery(LOGIN, {
    variables: { userNameOrEmail: email, password: password },
  });

  const navigate = (route: string) => routeHistory.push(route)

  function submit() {

    if (!loading && !error && data) {
      localStorage.setItem('token', data.login.token);

      authenticatedVal(true)
      navigate('/')

    }
    if (error) {
      alert("you have an error" + error)
    }

  }

  return (
    <div>
      <Logo />
      <div className="register-container mt-4">
        <strong className="text-4xl font-serif"> Log in to Twitter </strong>

        <FormInput
          type="name"
          name="email"
          className="w-full h-16 -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-300"
          placeholder="Email or userName"
          onChange={($e: FormEvent<HTMLInputElement>) => setEmail($e.currentTarget.value.trim())}
        />

        <FormInput
          type="password"
          name="password"
          placeholder="Password"
          className="w-full h-16 -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-300"
          onChange={($e: FormEvent<HTMLInputElement>) => setPassword($e.currentTarget.value.trim())}
        />

        <TweetButton name="Login" className="w-80 ml-4" onClick={() => email && password && submit()} />


        <div className="mt-3" >
          <Link to="/forget_password" className="a_login_form m-8">
            Forget password?
            </Link>

          <Link to="/signUp" className="a_login_form">
            Sign up for Twitter
            </Link>
        </div>

      </div>
    </div>
  )
}


