import { ErrorMessage, Field, Form, Formik } from "formik"
import React, { useRef, useState } from "react"
import * as Yup from "yup"
import { TweetButton } from '../sideBar/tweetButton/tweetButton'
import { Tweets } from '../../common/queries/TweetQuery'
import { FeedTweets } from '../../common/queries/Feedtweets'
import { Post_Tweet } from '../../common/queries/createTweet'
import {updateTweetsCacheForCreateTweet} from "../../common/utils/writeCache"
import './tweet.css';
import avatar from "../../routes/mjv-d5z8_400x400.jpg";
import { parseJwt } from '../../common/decode';
import axios from 'axios';
import { useQuery, gql, useMutation } from '@apollo/client';
interface Post {
  text: string
}
const PostTweet = () => {
  var profile: any;
  if (localStorage.getItem('token') !== "LOGOUT") {
    profile = parseJwt(localStorage.getItem('token'))
  }
  console.log(profile.id)
  // const userData = useQuery (Get_Logged_user)
  // const user:User = userData.data.logUser.user
  // console.log (user.imageURL)

  const inputRef: any = useRef()
  // mutation
  const [createTweet, { data }] = useMutation(Post_Tweet, {
    update: updateTweetsCacheForCreateTweet
  });
  console.log(`this ${inputRef.current}`)

  const initialValues: Post = {
    text: ""
  }
  //////////////////// upload media //////////////////
  const upload: any = useRef()
  const [media, setmedia] = useState(false)
  const [mediaURL, setmediaURL] = useState("")
  const [mediaURLs , setmediaURLs] = useState<any>([])
  const [medias , setmedias] = useState<any>([])
  const [apis, setAPIs] = useState<any>([])
   
  // var  uploadedMedia: { Media :object | false , MediaURL :string|false} 
  const { data: APIENDPOINT, loading, refetch } = useQuery(gql`query{getUploadURL}`)
  if (loading) {
    console.log("loading...........")
  }
  if(!loading && APIENDPOINT){
    if(APIENDPOINT.getUploadURL !== apis[apis.length-1]){
      setAPIs([...apis, APIENDPOINT.getUploadURL])
    }
  }

  const handleUpload = async () => {
    let urlsData = await  medias.map ( async(media:any)=>{
      let url:any= await axios.put(apis.pop(),media, {
        headers: {
          'Content-Type': 'application/x-binary'
        }
      })
      console.log ("url", url.config.url.split('?')[0])
      return url.config.url.split('?')[0]

    })
    // 
    console.log (urlsData)
    return await Promise.all(urlsData)
  }
  const handleFile = (e: any) => {
    setmedia( e.target.files[0])
    setmedias ([...medias, e.target.files[0]])
    
    setmediaURLs( [...mediaURLs, URL.createObjectURL(e.target.files[0])])
    refetch()
    console.log (media,mediaURL)
  }

  const displayUploadedFiles=(urls:string[])=> {
    return urls.map((url, i) => 
    <img className="object-cover w-full" key={i} src={url}/>);
  }
  
  /********   dynamic hight control funtion   ***********/
  function setInputHight(element: React.ChangeEvent<HTMLElement>) {
    element.target.style.height = "60px"
    element.target.style.height = (element.target.scrollHeight) + "px"
    inputRef.current.style.height = (element.target.scrollHeight) + "px"
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
        <img src={avatar} alt="avatar" />
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={({ text }, { setSubmitting, resetForm }) => {
          

          if(media) {handleUpload().then ( (urls)=> {
            createTweet({
              variables: { tweetInput: {text, mediaURLs:urls }}
            });
          })}

        
          setmedia (false)
          setmediaURL ("")
          setSubmitting(true);
          // console.log (media,mediaURL)

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
             {/* grid grid-cols-2 gap-0.5 */}
             <div className="w-full max-h-26 ">

             <div className="gg-box   ">
             { displayUploadedFiles(mediaURLs) }
             </div>
             </div>

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
