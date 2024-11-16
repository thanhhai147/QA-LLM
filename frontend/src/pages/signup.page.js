import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/SignupPage.css";

const SignupPage = () => {
  const navigate = useNavigate();

  return (
    <div className="wrapper">
      <nav className="nav">
        <div className="nav-logo">
          <p>Welcome!</p>
        </div>
        <div className="nav-button">
          <button
            className="btn"
            id="loginBtn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button className="btn white-btn" id="registerBtn">
            Sign Up
          </button>
        </div>
      </nav>

      <div className="form-box">
        <div className="register-container" id="register">
          <div className="top">
            <span>
              Already have an account?{" "}
              <a href="#" onClick={() => navigate("/login")}>
                Login
              </a>
            </span>
            <header>SIGN UP</header>
          </div>
          <div className="two-forms">
            <div className="input-box">
              <input
                type="text"
                className="input-field"
                placeholder="Firstname"
              />
              <i className="bx bx-user"></i>
            </div>
            <div className="input-box">
              <input
                type="text"
                className="input-field"
                placeholder="Lastname"
              />
              <i className="bx bx-user"></i>
            </div>
          </div>
          <div className="input-box">
            <input type="text" className="input-field" placeholder="Email" />
            <i className="bx bx-envelope"></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              className="input-field"
              placeholder="Password"
            />
            <i className="bx bx-lock-alt"></i>
          </div>
          <div className="input-box">
            <input type="submit" className="submit" value="Register" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
