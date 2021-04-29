import React, { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "./../Register.css";
import { parse, isDate } from "date-fns";

import { TweetButton } from "./../../sideBar/tweetButton/tweetButton";
import { Logo } from "./../../logo/logo";
import { FormInput } from "./../formInput/formInput";
import { ADD_USER } from "../../../common/queries/createUser";
import { New_User, User } from "../../../interface/signUp";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { DatePicker } from "@material-ui/pickers";

export function SignUpForm() {
    //set state to catch changes in form
    const [name, setName] = useState("");
    const [userName, setUserName] = useState(" ");
    const [email, setEmail] = useState(" ");
    const [password, setPassword] = useState(" ");
    const [birthDate, setValue] = React.useState<any>(new Date("2014-08-18"));
    const today = new Date();
    function parseDateString(value: any, originalValue: any) {
      const parsedDate = isDate(originalValue)
        ? originalValue
        : parse(originalValue, "yyyy-MM-dd", new Date());
    
      return parsedDate;
    }
    const [createUser, { error, data }] = useMutation<
        { createUser: User },
        { userInput: New_User }
    >(ADD_USER, {
        variables: {
            userInput: { userName, email, password, name, birthDate },
        },
    });

    const signInValidationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email!")
            .max(70, "Value is too long!")
            .required("This filed is required!"),
        password: Yup.string()
            .min(8, "Password must be equal to or more than than 8 chars!")
            .max(70, "Value is too long!")
            .required("This filed is required!"),
        userName: Yup.string()
            .min(4, "User name must be equal to or more than than 4 chars!")
            .max(15, "User name must be equal to or less than than 15 chars!")
            .required("This field is required!"),
        name: Yup.string()
            .max(50, "name must be equal to or less than 50 chars!")
            .required("This field is required!"),
        birthDate: Yup.date()
            .transform()
    });

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div className="register-container mt-4 text-center">
                <Logo />

                <strong className="text-4xl font-serif mt-4 ">
                    Create Your Account
                </strong>

                <Formik
                    initialValues={{
                        email: "",
                        password: "",
                    }}
                    validationSchema={signInValidationSchema}
                    onSubmit={({ email, password }) => {
                        email &&
                            password &&
                            login({
                                variables: {
                                    userNameOrEmail: email,
                                    password: password,
                                },
                            });
                    }}
                >
                    {({ errors, touched }) => (
                        <Form>
                            <Field
                                type="name"
                                name="email"
                                className="w-4/5 h-16  pl-10 pr-10 py-2 rounded-lg border-2 border-gray-200 outline-none hover:border-blue-300 transition duration-300 focus:border-blue-300 mb-2 mt-4"
                                placeholder="Email or Username"
                            />
                            {errors.email && touched.email ? (
                                <div className="text-red-700 text-left pl-10 w-4/5 ml-auto mr-auto">
                                    {errors.email}
                                </div>
                            ) : null}
                            <Field
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="w-4/5 h-16  pl-10 pr-10 py-2 rounded-lg border-2 border-gray-200 outline-none hover:border-blue-300 transition duration-300 focus:border-blue-300 mb-2 mt-4"
                            />
                            {errors.password && touched.password ? (
                                <div className="text-red-700 text-left pl-10 w-4/5 ml-auto mr-auto">
                                    {errors.password}
                                </div>
                            ) : null}
                            {error ? (
                                <div className="text-red-700 mt-5">
                                    {error ? error.message : ""}
                                </div>
                            ) : null}
                            {console.log("rerendered correctly")}
                            <TweetButton
                                name="Login"
                                disabled={loading}
                                className="w-3/5  mt-8 h-12"
                                type="submit"
                            />
                        </Form>
                    )}
                </Formik>

                <form>
                    <FormInput
                        type="email"
                        name="email"
                        onChange={($e: FormEvent<HTMLInputElement>) =>
                            setEmail($e.currentTarget.value)
                        }
                        className="w-4/5 h-16  pl-10 pr-10 py-2 rounded-lg border-2 border-gray-200 outline-none hover:border-blue-300 transition duration-300 focus:border-blue-300 mb-2 mt-4"
                        placeholder="Email"
                    />

                    <FormInput
                        type="password"
                        name="password"
                        onChange={($e: FormEvent<HTMLInputElement>) =>
                            setPassword($e.currentTarget.value)
                        }
                        className="w-4/5 h-16  pl-10 pr-10 py-2 rounded-lg border-2 border-gray-200 outline-none hover:border-blue-300 transition duration-300 focus:border-blue-300 mb-2 mt-4"
                        placeholder="Password"
                    />

                    <div className="grid grid-cols-2 ml-auto mr-auto w-4/5 gap-10 mt-6">
                        <FormInput
                            type="name"
                            name="name"
                            onChange={($e: FormEvent<HTMLInputElement>) =>
                                setName($e.currentTarget.value)
                            }
                            className="h-16  rounded-lg border-2 border-gray-200 outline-none hover:border-blue-300 transition duration-300 focus:border-blue-300 pl-8 pr-8 w-full"
                            placeholder="Name"
                        />
                        <FormInput
                            type="name"
                            name="userName"
                            onChange={($e: FormEvent<HTMLInputElement>) =>
                                setUserName($e.currentTarget.value)
                            }
                            className="h-16  rounded-lg border-2 border-gray-200 outline-none hover:border-blue-300 transition duration-300 focus:border-blue-300 pl-8 pr-8 w-full"
                            placeholder="User name"
                        />
                    </div>

                    <div className=" mt-8 text-left w-4/5 ml-auto mr-auto">
                        <strong className="text-2xl font-serif">
                            {" "}
                            Date of birth{" "}
                        </strong>
                        <p className="text-1xl font-serif text-gray-500">
                            {" "}
                            This will not be shown publicly. Confirm your own
                            age.{" "}
                        </p>
                    </div>

                    <div
                        className="text-left w-4/5 ml-auto mr-auto"
                        style={{ color: "red" }}
                    >
                        <DatePicker
                            disableFuture
                            openTo="year"
                            value={birthDate}
                            format="yyyy - MM - dd"
                            onChange={(newValue: any) => {
                                newValue = newValue.toISOString().split("T")[0];
                                setValue(newValue);
                            }}
                        />
                    </div>

                    <Link to="/login">
                        <TweetButton
                            name="Sign Up!"
                            className="w-80 mt-8 h-12"
                            onClick={() =>
                                name &&
                                userName &&
                                email &&
                                password &&
                                birthDate &&
                                createUser()
                            }
                        />
                    </Link>

                    <div className="mt-4">
                        <Link
                            to="/login"
                            className="a_login_form mt-12 transition hover:text-blue-800 duration-300"
                        >
                            Aready have account?
                        </Link>
                    </div>
                </form>
            </div>
        </MuiPickersUtilsProvider>
    );
}

export default SignUpForm;
