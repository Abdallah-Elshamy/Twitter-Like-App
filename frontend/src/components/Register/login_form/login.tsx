import { useLazyQuery } from "@apollo/client";
import { Link, useHistory } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import "./../../../styles/layout.css";
import "./../Register.css";
import { TweetButton } from "./../../sideBar/tweetButton/tweetButton";
import { Logo } from "./../../logo/logo";
import { LOGIN } from "../../../common/queries/login_query";
import * as Yup from "yup";

export function Login() {
    const routeHistory = useHistory();

    const [login, { data, loading, error }] = useLazyQuery(LOGIN);

    const navigate = (route: string) => routeHistory.push(route);
    if (!loading && !error && data) {
        localStorage.setItem("token", data.login.token);
        navigate("/");
    }
    const signInValidationSchema = Yup.object().shape({
        email: Yup.string()
            .min(4, "Value is too short!")
            .max(70, "Too Long!")
            .required("This filed is required!"),
        password: Yup.string()
            .min(8, "Password must be equal to or more than 8 chars!")
            .required("This filed is required!"),
    });

    return (
        <div>
            <div className="register-container mt-4 text-center">
                <Logo />
                <strong className="text-4xl font-serif mt-4">
                    Log In To Twitter
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
                                <div className="text-red-700 text-left pl-10 w-4/5 ml-auto mr-auto">{errors.email}</div>
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

                <div className="mt-3">
                    <Link to="/forget_password" className="a_login_form transition mr-4 hover:text-blue-800 duration-300">
                        Forget password?
                    </Link>

                    <Link to="/signUp" className="a_login_form transition ml-4 hover:text-blue-800 duration-300">
                        Sign up for Twitter
                    </Link>
                </div>
            </div>
        </div>
    );
}
