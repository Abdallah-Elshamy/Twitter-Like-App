import { ErrorMessage, Field, Form, Formik } from "formik"
import React, { useState } from "react"
import * as Yup from "yup"
import { TweetButton } from '../sideBar/tweetButton/tweetButton'
import {Tweets} from '../../common/queries/TweetQuery'
import {FeedTweets} from '../../common/queries/Feedtweets'
import   {Post_Tweet}  from '../../common/queries/createTweet'
import { useMutation, useQuery } from "@apollo/client"

import {Get_Logged_user} from "../../common/queries/localUser"
import './tweet.css';
import avatar from "../../routes/mjv-d5z8_400x400.jpg";

interface Post {
  text:string
}
const  PostTweet =()=> {
  const userData = useQuery (Get_Logged_user)

  // console.log(userData.data.logUser.user)

  const [createTweet , {data}]  = useMutation (Post_Tweet);

  const initialValues: Post = {
    text: ""
	}
  return (
    <div className="mb-3 p-3 w-full shadow bg-white flex">
      <div className="tweet-icon">
      <img src={avatar} alt="avatar"/>
      </div>
      <Formik 
        initialValues ={initialValues}
        onSubmit={({text}, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          console.log (text);
          createTweet ({
            variables :{tweetInput: {text}  } ,
            refetchQueries :[{query:FeedTweets}]
          });
          console.log (`this ${data}`)
          setSubmitting(false);
          resetForm();
        }}
      >
        <div className="w-full mx-4">
          <Form>
            <div className="w-full mb-2 h-16 tweet-text">
              <Field
              name="text"
              type="text"
              className="w-full placeholder-gray4 p-3 ml-2 focus:outline-none "
              placeholder="What's happening..."/>
              <ErrorMessage name="content" component={"div"} />
            </div>
            <hr className="my-2" />
            <div className="flex justify-between items-center">
                <button className="hover:bg-blue-100 rounded-full py-2 px-3 transition">
                <svg 
                  className="h-8 w-8 text-blue-400 "
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                </button>
              <TweetButton name="Tweet" type="submit" className=" rounded-full py-3 px-6"/>
            </div>
          </Form>
        </div>
      </Formik>
    </div>
  )
}

export default PostTweet
