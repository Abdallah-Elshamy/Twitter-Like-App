import React from 'react';
import { Link } from "react-router-dom";

import { TweetButton } from '../../sideBar/tweetButton/tweetButton';
import Footer from '../../TrendsBar/Footer/Footer';

import logo from "./../../../routes/Twitter-Logo.png";

export const LandingPage: React.FC = () => (
  <div >
    <div className=" grid grid-cols-2  w-full  ">

      <div >
        <img
          src="https://abs.twimg.com/sticky/illustrations/lohp_en_1302x955.png"
          className=" max-w-1/2 min-h-full md:none" alt="landing page" />
      </div>

      <div>
        <div className="flex ">
          <input type="Email" className="h-10 w-40 pr-3 py-2 pl-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-300 mt-4 ml-12"
            placeholder="Email" />

          <div>
            <input type=" password" className="h-10 w-40 pr-3 py-2 pl-2 rounded-lg border-2 border-gray-200 outline-none
                         focus:border-blue-300 mt-4 ml-4"
              placeholder="   Password" />
            <p className="ml-4 mt-2 text-sm text-blue-400">

              <Link to="/forget_password" className="a_login_form m-4">
                Forget password?
            </Link>
            </p>
          </div>
          <TweetButton name="login" className="w-28 ml-4 " />
        </div>

        <img src={logo} alt=" Twitter-Logo " className="h-8  mt-12 ml-12 flex" />
        <p className=" ml-12 mt-12 text-6xl font-extrabold"> Happenning now</p>
        <p className=" ml-12 mt-12 text-4xl font-bold ">Join twitter today. </p>
        <Link to="/SignUp">
                    < TweetButton name = "Sign Up" className = "w-80 ml-12 mt-8 font-semibold h-12 mt-8" />
                    </Link>
                    
                    <Link to="/login">
                    < TweetButton name = "Log in"  className =  "w-80 ml-12 font-semibold h-12 mt-8"/>
                    </Link>
      </div>

    </div>
    <div className="pt-4 w-full flex justify-center"><Footer /></div>
  </div>

)