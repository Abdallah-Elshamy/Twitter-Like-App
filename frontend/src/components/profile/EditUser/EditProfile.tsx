import { Field, Formik } from 'formik';
import React, { MouseEventHandler, useRef, useState } from 'react';
import { object, string } from 'yup';
import { User } from '../../../common/TypesAndInterfaces';
import '../profile.css';
import InputSet from './InputSet';
import { gql, useMutation, useQuery } from '@apollo/client';
import { EditUser } from '../../../common/queries/EditUser';
import avatar from "../../../routes/mjv-d5z8_400x400.jpg";
import './EditProfile.css'
import { EditProfileBgVal, EditProfileImageVal } from '../../../common/cache';
import { GetEditProfileImage } from '../../../common/queries/GetEditProfileImage';
import axios from 'axios';
import { GetEditBgImage } from '../../../common/queries/GetEditBgImage';
import { DeleteMedia } from '../../../common/queries/DeleteMedia';
import Loading from '../../../UI/Loading';
import { LoggedUser } from '../../../common/queries/Userqery';


type Props = {
  user: User,
  close: MouseEventHandler,
  show: Boolean
}
interface initials {
  name: String,
  bio?: String,
  birthdate: String

}
const EditProfile: React.FC<Props> = ({ user, close, show }) => {
  //save media apis in state
  const [apis, setAPIs] = useState<any>([])

  const [loadingSave, setLoadingSave] = useState<boolean>(false)

  const [editUser, { loading: mutLoading }] = useMutation(EditUser)
  const [deleteMedia] = useMutation(DeleteMedia)
  //console.log(delData, delError)
  const { data: avatarData } = useQuery(GetEditProfileImage)
  if (avatarData) {
    var { EditProfileImage: { Image, ImageURL } } = avatarData
  }

  const { data: BgData } = useQuery(GetEditBgImage)
  if (BgData) {
    //console.assert(BgData, "happened")

    var { EditProfileBg: { BgImage, BgImageURL } } = BgData
    // console.log(BgImageURL)
  }

  const { data: APIENDPOINT, loading, refetch } = useQuery(gql`query{getUploadURL}`)

  if (!loading && APIENDPOINT) {
    if (APIENDPOINT.getUploadURL !== apis[apis.length - 1]) {
      setAPIs([...apis, APIENDPOINT.getUploadURL])
    }
  }


  //initial values for formik
  const initialValues: initials = {
    name: user.name,
    bio: user.bio || "",
    birthdate: user.birthDate || "06/11/1998"
  }

  //validation schema for yup
  const validationSchema = object({
    name: string()
      .required('Required')
      .max(50, 'Too long'),
    bio: string().max(250, "Too long"),
  })

  //formik ref
  const formRef: any = useRef();
  //used after save
  const closeButton: any = useRef();
  //avatar image ref
  const avatarButton: any = useRef()

  const BgButton: any = useRef()



  const save = async () => {
    setLoadingSave(true)
    const dataValues = formRef.current.values
    dataValues.bio = dataValues.bio.replaceAll(/  +/g, ' ');
    //convert date to string
    let ageError
    let yourDate = dataValues.birthdate
    if (typeof yourDate == 'string') ageError = false
    else {
      yourDate = new Date(dataValues.birthdate.getTime() - (yourDate.getTimezoneOffset() * 60 * 1000))
      yourDate = yourDate.toISOString().split('T')[0]
      //check age is older than 12
      ageError = !((new Date().getFullYear() - Number(yourDate.substring(0, 4))) >= 12)
      if (!ageError) dataValues.birthdate = yourDate
    }

    //overall error
    let error = ((Object.keys(formRef.current.errors).length !== 0) || ageError)

    if (!error) {
      if (Image) {
        var pfUrl = await Promise.resolve(handleImageUpload(Image))
        if (pfUrl && user.imageURL && user.imageURL !== '') {
          let lastIndex = Number(user.imageURL?.lastIndexOf('/')) + 1
          let id = user.imageURL?.substr(lastIndex || 0)
          deleteMedia({
            variables: {
              id: id
            }
          })
        }
      }
      if (BgImage) {
        var bgUrl = await Promise.resolve(handleImageUpload(BgImage))
        if (bgUrl && user.coverImageURL && user.coverImageURL !== '') {

          let lastIndex = Number(user.coverImageURL?.lastIndexOf('/')) + 1
          let id = user.coverImageURL?.substr(lastIndex || 0)
          deleteMedia({
            variables: {
              id: id
            }
          })
        }
      }
      //console.log(`profile link:${pfUrl}\nbackground link:${bgUrl}\n`)
      await editUser({
        variables:
        {
          userInput:
          {
            name: dataValues.name,
            bio: dataValues.bio,
            birthDate: dataValues.birthdate,
            imageURL: apis && pfUrl,
            coverImageURL: apis && bgUrl
          },
          refetchQueries: [{
            qurey: LoggedUser
          }]
        }
      })

      !mutLoading && closeButton.current.click()
    }

    setLoadingSave(false)

  }

  const handleImageUpload: any = async (image: any, type?: Number) => {
    let url: any = await axios.put(apis.pop(), image, {
      headers: {
        'Content-Type': `${image.type}`
      }
    }).catch((e) => undefined)


    return url.config.url.split('?')[0]

  }

  const handleAvatarPreview = (e: any) => {
    EditProfileImageVal({
      Image: e.target.files[0],
      ImageURL: URL.createObjectURL(e.target.files[0])
    })
    refetch()

  }

  const handleBgPreview = (e: any) => {

    EditProfileBgVal({
      BgImage: e.target.files[0],
      BgImageURL: URL.createObjectURL(e.target.files[0])
    })
    refetch()


  }

  return (
    show && <div className="py-4">

      <header className="flex justify-between  items-center px-3 h-6 w-full border-b border-gray-200 pb-6 pt-2">

        <div onClick={close} ref={closeButton} className="hover:bg-red-100 p-1 rounded-full">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <div>
          {loadingSave ? <Loading size={30} /> :
            <h1 className="font-bold font-lg">Edit Profile</h1>
          }
        </div>

        <div>
          <button onClick={save} disabled={loadingSave}
            className="inline-block rounded-full px-4 
           py-1.5 font-semibold  text-gray-800 border 
           border-blue-400 outline-none 
           hover:border-blue-500 hover:cursor-pointer
           disabled:bg-gray-100 disabled:border-gray-200 disabled:cursor-not-allowed 
              ">
            Save
          </button>
        </div>
      </header>

      <main className="p-4">

        <div className="media h-64 ">
          <div className="pf--bg relative " >

            {

              (BgImageURL || user.coverImageURL) ? <img className="" src={BgImageURL || user.coverImageURL}
                alt="bg" /> : null
            }
            <div className="absolute top-0  h-full w-full 
            hover:bg-gray-100 hover:bg-opacity-25 
             p-16 "
              onClick={() => BgButton.current.click()}
            >

              <svg className="h-6 text-white m-auto opacity-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <input className=" hidden" type="file" onChange={(e) => handleBgPreview(e)} accept="image/*" ref={BgButton} />


          </div>


          <div className="pf--avatar-edit" >
            {(

              <img className="pf--avatar-img" src={ImageURL || user.imageURL || avatar}
                alt="avatar" />


            )}
            <div className="absolute h-100 w-100 
            hover:bg-gray-100 hover:bg-opacity-25 
            rounded-full p-16 "
              onClick={() => avatarButton.current.click()}
            >

              <svg className="h-6 text-white opacity-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <input className="hidden" type="file" onChange={(e) => handleAvatarPreview(e)} accept="image/*" ref={avatarButton} />
          </div>

        </div>

        <div className="text w-full">
          <Formik initialValues={initialValues}
            validationSchema={validationSchema}
            innerRef={formRef} onSubmit={(values, actions) => {

            }}>
            {({ values, setFieldValue, errors, touched }) => (<form>

              <div className=" hover:text-blue-500 hover:border-blue-400
              rounded-md border border-gray-300 text-gray-800 px-2 mb-2 py">

                <label htmlFor="name" className=" w-14 inline-block text-xs ">
                  Name
                </label>
                <p className="inline-block float-right text-xs">{values.name.length}/{50}</p>
                <Field className=" w-full focus:outline-none block h-6 mb-2"
                  id="name" name="name" maxLength="50" />
                {errors.name && touched.name ? (
                  <div className="text-red-600 font-semibold">{errors.name}</div>
                ) : null}
              </div>

              <br />
              <div className=" hover:text-blue-500 hover:border-blue-400
              rounded-md border border-gray-300 text-gray-800 px-2 mb-2 py">

                <label htmlFor="bio" className=" w-14 inline-block text-xs ">
                  Bio
                </label>
                <p className="inline-block float-right text-xs">{(values.bio == null) ? "0" : values.bio?.length}/{250}</p>
                <Field className=" w-full focus:outline-none block h-32 resize-none"
                  id="bio" name="bio" maxLength="250" as="textarea" />
                {errors.bio && touched.bio ? (
                  <div className="text-red-600 font-semibold">{errors.bio}</div>
                ) : null}
              </div>

              <div className=" 
              rounded-md text-gray-800 px-2 mb-2 py">
                <Field id="birthdate" name="birthdate" as={InputSet} bD={values.birthdate} setF={setFieldValue} ></Field>
                {errors.birthdate && touched.birthdate ? (
                  <div className="text-red-600 font-semibold">{errors.birthdate}</div>
                ) : null}
              </div>

            </form>)}
          </Formik>
        </div>

      </main>
    </div>
  )
}
export default EditProfile;
