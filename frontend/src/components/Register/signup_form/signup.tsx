import { Link, useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "./../Register.css";
import { parse, isDate } from "date-fns";
import { TweetButton } from "./../../sideBar/tweetButton/tweetButton";
import { Logo } from "./../../logo/logo";
import { ADD_USER } from "../../../common/queries/createUser";
import { New_User, User } from "../../../interface/signUp";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { DatePicker } from "@material-ui/pickers";

export function SignUpForm() {
    const routeHistory = useHistory();
    const [createUser, { error: errorData, data, loading }] = useMutation<
        { createUser: User },
        { userInput: New_User }
    >(ADD_USER, { errorPolicy: "all" });
    const error = errorData as any;
    let validators: any = undefined;
    let nameValidators: any,
        emailValidators: any,
        userNameValidators: any,
        passwordValidators: any,
        birthDateValidators: any;
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    const twelveYear = new Date(year - 12, month, day);
    const twelveYearString = twelveYear.toISOString().split("T")[0];
    function parseDateString(value: any, originalValue: any) {
        const parsedDate = isDate(originalValue)
            ? originalValue
            : parse(originalValue, "yyyy-MM-dd", new Date());

        return parsedDate;
    }
    if (error?.graphQLErrors[0]?.validators) {
        validators = error.graphQLErrors[0].validators;
        emailValidators = validators?.filter((validator: any) => {
            return validator.value === "email";
        });
        nameValidators = validators?.filter((validator: any) => {
            return validator.value === "name";
        });
        userNameValidators = validators?.filter((validator: any) => {
            return validator.value === "userName";
        });
        passwordValidators = validators?.filter((validator: any) => {
            return validator.value === "password";
        });
        birthDateValidators = validators?.filter((validator: any) => {
            return validator.value === "birthDate";
        });
    }

    if (!error && !loading && data) {
        routeHistory.push("/login");
    }
    const signUpValidationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email!")
            .max(70, "Value is too long!")
            .required("This filed is required!"),
        password: Yup.string()
            .min(8, "Password must be equal to or more than than 8 chars!")
            .max(70, "Value is too long!")
            .required("This filed is required!"),
        userName: Yup.string()
            .matches(
                /^[a-zA-Z0-9_]*$/i,
                "Username can only contain letters, numbers, and underscores"
            )
            .min(4, "User name must be equal to or more than than 4 chars!")
            .max(15, "User name must be equal to or less than than 15 chars!")
            .required("This field is required!"),
        name: Yup.string()
            .max(50, "name must be equal to or less than 50 chars!")
            .required("This field is required!"),
        birthDate: Yup.date()
            .transform(parseDateString)
            .max(
                twelveYear,
                "You must be more than 12 years old to create an acount!"
            )
            .required("This field is required"),
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
                        userName: "",
                        name: "",
                        birthDate: twelveYearString,
                    }}
                    validationSchema={signUpValidationSchema}
                    onSubmit={async ({
                        email,
                        password,
                        userName,
                        name,
                        birthDate,
                    }) => {
                        try {
                            await createUser({
                                variables: {
                                    userInput: {
                                        name,
                                        userName,
                                        email,
                                        password,
                                        birthDate,
                                    },
                                },
                            });
                        } catch (e) {
                            //prevent app from crashing
                        }
                    }}
                >
                    {({
                        errors,
                        touched,
                        values,
                        setFieldValue,
                        handleChange,
                    }) => (
                        <Form>
                            <Field
                                type="email"
                                name="email"
                                className="w-4/5 h-16  pl-10 pr-10 py-2 rounded-lg border-2 border-gray-200 outline-none hover:border-blue-300 transition duration-300 focus:border-blue-300 mb-2 mt-4"
                                placeholder="Email"
                                onChange={(e: any) => {
                                    emailValidators = [];
                                    handleChange(e);
                                }}
                            />
                            {(errors.email && touched.email) ||
                            emailValidators?.length > 0 ? (
                                <div className="text-red-700 text-left pl-10 w-4/5 ml-auto mr-auto">
                                    {errors?.email}
                                    {emailValidators?.map(
                                        (validator: any) => validator.message
                                    )}
                                </div>
                            ) : null}
                            <Field
                                type="password"
                                name="password"
                                className="w-4/5 h-16  pl-10 pr-10 py-2 rounded-lg border-2 border-gray-200 outline-none hover:border-blue-300 transition duration-300 focus:border-blue-300 mb-2 mt-4"
                                placeholder="Password"
                                onChange={(e: any) => {
                                    passwordValidators = [];
                                    handleChange(e);
                                }}
                            />
                            {(errors.password && touched.password) ||
                            passwordValidators?.length > 0 ? (
                                <div className="text-red-700 text-left pl-10 w-4/5 ml-auto mr-auto">
                                    {errors?.password}
                                    {passwordValidators?.map(
                                        (validator: any) => validator.message
                                    )}
                                </div>
                            ) : null}
                            <div className="grid grid-cols-2 ml-auto mr-auto w-4/5 gap-3 mt-6">
                                <Field
                                    type="name"
                                    name="name"
                                    className="h-16  rounded-lg border-2 border-gray-200 outline-none hover:border-blue-300 transition duration-300 focus:border-blue-300 pl-8 pr-8 w-full"
                                    placeholder="Name"
                                    onChange={(e: any) => {
                                        nameValidators = [];
                                        handleChange(e);
                                    }}
                                />
                                <Field
                                    type="name"
                                    name="userName"
                                    className="h-16  rounded-lg border-2 border-gray-200 outline-none hover:border-blue-300 transition duration-300 focus:border-blue-300 pl-8 pr-8 w-full"
                                    placeholder="User name"
                                    onChange={(e: any) => {
                                        userNameValidators = [];
                                        handleChange(e);
                                    }}
                                />
                                {(errors.name && touched.name) ||
                                nameValidators?.length > 0 ? (
                                    <div className="text-red-700 text-left pl-8 w-full col-start-1">
                                        {errors?.name}
                                        {nameValidators?.map(
                                            (validator: any) =>
                                                validator.message
                                        )}
                                    </div>
                                ) : null}
                                {(errors.userName && touched.userName) ||
                                userNameValidators?.length > 0 ? (
                                    <div className="text-red-700 text-left pl-8 w-full col-start-2">
                                        {errors?.userName}
                                        {userNameValidators?.map(
                                            (validator: any) =>
                                                validator.message
                                        )}
                                    </div>
                                ) : null}
                            </div>
                            <div className="mt-8 text-left w-4/5 ml-auto mr-auto">
                                <strong
                                    className={`text-2xl font-serif ${
                                        errors.birthDate ? "text-red-700" : ""
                                    }`}
                                >
                                    Date of birth
                                </strong>
                                <p className="text-1xl font-serif text-gray-500">
                                    This will not be shown publicly. Confirm
                                    your own age.
                                </p>
                            </div>

                            <div
                                className="text-left w-4/5 ml-auto mr-auto"
                                style={{ color: "red" }}
                            >
                                <DatePicker
                                    disableFuture
                                    openTo="year"
                                    value={values.birthDate}
                                    format="yyyy - MM - dd"
                                    onChange={(newValue: any) => {
                                        newValue = newValue
                                            .toISOString()
                                            .split("T")[0];
                                        setFieldValue("birthDate", newValue);
                                        birthDateValidators = [];
                                    }}
                                />
                                {errors.birthDate ||
                                birthDateValidators?.length > 0 ? (
                                    <div className="text-red-700 text-left  w-4/5 ">
                                        {errors?.birthDate}
                                        {birthDateValidators?.map(
                                            (validator: any) =>
                                                validator.message
                                        )}
                                    </div>
                                ) : null}
                            </div>
                            <TweetButton
                                name="Sign Up!"
                                disabled={loading}
                                className="w-3/5  mt-8 h-12"
                                type="submit"
                            />

                            <div className="mt-4">
                                <Link
                                    to="/login"
                                    className="a_login_form mt-12 transition hover:text-blue-800 duration-300"
                                >
                                    Already have an account?
                                </Link>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </MuiPickersUtilsProvider>
    );
}

export default SignUpForm;
