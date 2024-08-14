import React from "react";
import "./Login-SignUp.css";
import Login from "./Login";
import SignUp from "./SignUp";
import logo from "./logo.png";

const LoginSignUp = () => {
   const toggleRef = React.useRef(null);
  return (
    
    <div className="container">
      <div className="login-logo">
        <img src={logo} />
      </div>
      ;
      <div class="wrapper">
        <div class="card-switch">
          <label class="switch">
            <input ref={toggleRef} type="checkbox" className="toggle" />
            <span class="slider"></span>
            <span class="card-side"></span>
            <div class="flip-card__inner">
              <div class="flip-card__front">
                <Login />
              </div>

              <div class="flip-card__back">
               <SignUp toggleRef={toggleRef}/>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
