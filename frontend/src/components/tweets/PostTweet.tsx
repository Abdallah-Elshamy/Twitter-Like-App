import { ErrorMessage, Field, Form, Formik } from "formik"
import React, { useRef, useState} from "react"
import { useQuery, gql, useMutation } from '@apollo/client';
import * as Yup from "yup"
import { TweetButton } from '../sideBar/tweetButton/tweetButton'
import {Tweets} from '../../common/queries/TweetQuery'
import {FeedTweets} from '../../common/queries/Feedtweets'
import   {Post_Tweet}  from '../../common/queries/createTweet'
import './tweet.css';
import { parseJwt } from '../../common/decode';
import { Get_SFW } from "../../common/queries/GET_SFW";
import avatar from "../../routes/mjv-d5z8_400x400.jpg";
import axios from 'axios';
interface Post {
  text:string
}
const  PostTweet =()=> {
  var profile:any;
  if (localStorage.getItem('token') !== "LOGOUT") {
    profile = parseJwt(localStorage.getItem('token'))
  }
  console.log (profile.id)
  // const userData = useQuery (Get_Logged_user)
  // const user:User = userData.data.logUser.user
  // console.log (user.imageURL)

  const inputRef:any = useRef ()
  const sfw = useQuery(Get_SFW).data
  // mutation
  const [createTweet , {data}]  = useMutation (Post_Tweet);
  console.log (`this ${inputRef.current}`)

  const initialValues: Post = {
    text: ""
  }
  /*********handling media uplaoding **************/
  const upload: any = useRef()
  const [media, setmedia] = useState(false)
  const [mediaURL, setmediaURL] = useState("")
  // var  uploadedMedia: { Media :object | false , MediaURL :string|false} 
  const { data: APIENDPOINT } = useQuery(gql`query{getUploadURL}`, { skip: !media })
  

  const handleUpload = async () => {
    APIENDPOINT && await axios.put(APIENDPOINT.getUploadURL,media, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(
      res => console.log(res)
    )
      .catch(error => console.error(error))
  }

  const handleFile = (e: any) => {
    setmedia( e.target.files[0])
    setmediaURL( URL.createObjectURL(e.target.files[0]))
    console.log (media,mediaURL)
  }

 
  /********   dynamic hight control funtion   ***********/
  function setInputHight (element:React.ChangeEvent<HTMLElement>){
    element.target.style.height = "60px"
    element.target.style.height = (element.target.scrollHeight)+"px"
    inputRef.current.style.height = (element.target.scrollHeight)+"px"

  }
  const validationSchema = Yup.object({
		text: Yup.string()
			.required()
			.min(1, "Must be more than 1 character")
			.max(256, "Must be less than 257 characters")
	})
  return (
    <div className="mb-3 p-3 w-full shadow bg-white flex">
      {/* this shoud be dynamic */}
      <div className="tweet-icon ">
      <img src={avatar} alt="avatar"/>   
      </div>
      <Formik 
        initialValues ={initialValues}
        validationSchema={validationSchema}
        onSubmit={({text}, { setSubmitting, resetForm }) => {
          if(media) handleUpload()
          setSubmitting(true);
          console.log (media,mediaURL)
          createTweet ({
            variables :{tweetInput: {text, mediaURLs: APIENDPOINT && APIENDPOINT.getUploadURL.split('?')[0] }
            }, 
            refetchQueries :[ {query:Tweets , 
              variables:{
                 userId: profile.id, 
                 filter:'', 
                 isSFW:sfw.SFW.value
                } 
              }, {query: FeedTweets, 
                variables: {
                  isSFW:sfw.SFW.value
                }}]
            
          });
          console.log (`this ${data}`)
          setSubmitting(false);
          resetForm();
        }}
      >
        <div className="w-full mx-4 flex flex-col">
          <Form >
            <div ref={inputRef} className="w-full mb-2 tweet-text flex h-16">
              <Field
              
              name="text"
              type="text"
              as="textarea"
              // onChange={setInputHight}
              onKeyPress={setInputHight}
              className="w-full placeholder-gray4 p-3 ml-2 
              focus:outline-none resize-none overflow-hidden min-h-12"
              placeholder="What's happening..."/>
            </div>
             {/* image */}
            {media && <img  src={mediaURL} />}
            <hr className="my-2" />
            <div className="flex justify-between items-center">
                <button className="hover:bg-blue-100 rounded-full py-2 px-3 transition focus:outline-none" onClick={()=>upload.current.click()}>
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
                <input className="file-upload  hidden focus:outline-none" type="file"  accept="image/*, video/*" ref={upload} onChange={(e)=> handleFile(e)} />
                </button>
                <ErrorMessage name="text"  render={msg => <div className="text-red-500">{msg}</div>} />
                
              <TweetButton name="Tweet" type="submit" className=" rounded-full py-3 px-6"/>
            </div>
            
          </Form>
        </div>
      </Formik>
    </div>
  )
}

export default PostTweet