import { ErrorMessage, Field, Form, Formik } from "formik"
import React, { Fragment, useRef, useState } from "react"
import * as Yup from "yup"
import { TweetButton } from '../sideBar/tweetButton/tweetButton'
import { Post_Tweet } from '../../common/queries/createTweet'
import {updateTweetsCacheForCreateTweet} from "../../common/utils/writeCache"
import './tweet.css';
import avatar from "../../routes/mjv-d5z8_400x400.jpg";
import { parseJwt } from '../../common/decode';
import axios from 'axios';
import { useQuery, gql, useMutation } from '@apollo/client';
import Viewer from 'react-viewer';
import { LoggedUser } from '../../common/queries/Userqery';
interface Post {
  text: string
}

const PostTweet = () => {
  const inputRef: any = useRef()
  const upload: any = useRef()
  const [media, setmedia] = useState(false)
  const [mediaURL, setmediaURL] = useState("")
  const [mediaURLs , setmediaURLs] = useState<any>([])
  const [medias , setmedias] = useState<any>([])
  const [apis, setAPIs] = useState<any>([])
  const [ visible, setVisible ] = React.useState(false);
  const initialValues: Post = {
    text: ""
  }
  if (localStorage.getItem('token')) var profile = parseJwt(localStorage.getItem('token'))
  const { loading:userLoad, data:userData } = useQuery (LoggedUser, { variables: { id: profile.id } });
  const [createTweet, { data }] = useMutation(Post_Tweet, {
    update: updateTweetsCacheForCreateTweet
  });
  const { data: APIENDPOINT, loading, refetch } = useQuery(gql`query{getUploadURL}`)

  if(!loading && APIENDPOINT) {
    if(APIENDPOINT.getUploadURL !== apis[apis.length-1]){
      setAPIs([...apis, APIENDPOINT.getUploadURL])
    }
  }
  if (userLoad) {return (<div></div>)}

  const handleUpload = async () => {
    let urlsData = await  medias.map ( async(media:any)=>{
      let url:any= await axios.put(apis.pop(),media, {
        headers: {
          'Content-Type': 'application/x-binary'
        }
      })
      // console.log ("url", url.config.url.split('?')[0])
      return url.config.url.split('?')[0]
    })
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
    <Fragment>
      <img className="object-cover w-full cursor-pointer " key={i} src={url} onClick={() => { setVisible(true);}}/>
      <Viewer
      visible={visible}
      onClose={() => { setVisible(false); } }
      images={[{ src: url || "", alt: 'background image'}]}
      />
    </Fragment>
    );
  }

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
    <div className="mb-3 tweet-box shadow bg-white flex">
      <div className="tweet-icon" >
         <img src= {userData.user.imageURL || avatar} alt="avatar" />
         {/* <img src= {avatar} alt="avatar" /> */}
      </div>
      <div className="tweet-aside">
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
            setSubmitting(false);
            resetForm();
          }}
        >
          <Form >
              <div ref={inputRef} className="w-full mb-2 tweet-text flex h-16">
                <Field
                name="text"
                type="text"
                as="textarea"
                onKeyPress={setInputHight}
                className="w-full placeholder-gray4 p-3 ml-2 
                focus:outline-none resize-none overflow-hidden min-h-12"
                placeholder="What's happening..."/>
              </div>

                <div className="gg-box ">
                { displayUploadedFiles(mediaURLs) }
              </div>
              <hr className="my-2" />
              <div className="flex justify-between items-center mb-2">
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
        </Formik>
      </div>
    </div>
  )
}

export default PostTweet
