import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="wrapper">
      <nav className="nav">
        <div className="nav-logo">
          <p>Welcome!</p>
        </div>
        <div className="nav-button">
          <button className="btn white-btn" id="loginBtn">
            Sign Up
          </button>
          <button
            className="btn"
            id="registerBtn"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </nav>

      <div className="form-box">
        <div className="login-container" id="login">
          <div className="top">
            <span>
              Don't have an account?{" "}
              <a href="#" onClick={() => navigate("/signup")}>
                Sign Up
              </a>
            </span>
            <header>LOGIN</header>
          </div>
          <div className="input-box">
            <input
              type="text"
              className="input-field"
              placeholder="Username or Email"
            />
            <i className="bx bx-user"></i>
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
            <input type="submit" className="submit" value="Sign In" />
          </div>
          <div className="two-col">
            <div className="one">
              <input type="checkbox" id="login-check" />
              <label htmlFor="login-check"> Remember Me</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
