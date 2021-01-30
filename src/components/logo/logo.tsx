import React from 'react';
import "./../Register/Register.css";
import logo from "./../../routes/Twitter-Logo.png" ;


export const Logo: React.FC = () =>  (

<div className=" register-container login-form">
  <img src={ logo } alt = " Twitter-Logo " className="h-8 w-16 mt-4"/>
</div>

)
