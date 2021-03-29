import { Field, Formik } from 'formik';
import React, { MouseEventHandler, useRef } from 'react';
import { object } from 'yup';
import { User } from '../../../common/TypesAndInterfaces';
import '../profile.css';
import InputSet from './InputSet';
import * as Yup from 'yup'
import { string } from 'yup';
import { date } from 'yup';
import moment from 'moment';
import { isDate, parse } from 'date-fns';

function parseDateString(value: any, originalValue: any) {
  const parsedDate = isDate(originalValue)
    ? originalValue
    : parse(originalValue, "yyyy-MM-dd", new Date());

  return parsedDate;
}

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


  const initialValues: initials = {
    name: user.name,
    bio: user.bio || "",
    birthdate: user.birthDate || "06/11/1998"
  }
  const now = new Date()
  const dateToday = new Date(`${now.getFullYear() - 18}/${now.getMonth()}/${now.getDay()}`)
  console.log(date)

  const validationSchema = object({
    name: string()
      .required('Required')
      .max(50, 'Too long'),
    bio: string().max(250, "Too long"),
    birthdate: date().transform(parseDateString).max(dateToday, "wrong")


  })

  const formRef: any = useRef();

  const save = () => {
    console.log(formRef.current.values)
  }
  return (
    show && <div className="py-4">
      <header className="flex justify-between  items-center px-3 h-6 w-full border-b border-gray-200 pb-6 pt-2">
        <div onClick={close} className="hover:bg-red-100 p-1 rounded-full"><svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg></div>
        <div><h1 className="font-bold font-lg">Edit Profile</h1></div>
        <div><button onClick={save}
          className="inline-block rounded-full px-4 py-1.5 font-semibold  text-gray-800 border border-blue-400">Save</button></div>
      </header>

      <main className="p-4">

        <div className="media">
        </div>

        <div className="text w-full">
          <Formik initialValues={initialValues}
            validationSchema={validationSchema}
            innerRef={formRef} onSubmit={(values, actions) => {
              console.log({ values, actions });
              alert(JSON.stringify(values, null, 2));
              actions.setSubmitting(false);
            }}>
            {({ values, setFieldValue, errors, touched }) => (<form>

              <div className=" hover:text-blue-500 hover:border-blue-400
              rounded-md border border-gray-300 text-gray-800 px-2 mb-2 py">

                <label htmlFor="name" className=" w-14 inline-block text-xs ">
                  Name
                </label>
                <p className="inline-block float-right text-xs">{values.name.length}/{50}</p>
                <Field className=" w-5/6 focus:outline-none block h-12"
                  id="name" name="name" maxLength="50" />
                {errors.name && touched.name ? (
                  <div className="text-red-600 font-semibold">{errors.name}</div>
                ) : null}
              </div>

              <br />
              <div className=" hover:text-blue-500 hover:border-blue-400
              rounded-md border border-gray-300 text-gray-800 px-2 mb-2 py">

                <label htmlFor="bio" className=" w-14 inline-block text-xs ">
                  Name
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
