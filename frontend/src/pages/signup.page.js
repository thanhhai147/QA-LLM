import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/SignupPage.css";

const SignupPage = () => {
  const navigate = useNavigate();

  return (
    <div className="wrapper">
      <nav className="nav">
        <div className="nav-logo">
          <p>Héloooooooo!</p>
        </div>
        <div className="nav-button">
          <button
            className="btn"
            id="loginBtn"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </button>
          <button className="btn white-btn" id="registerBtn">
            Đăng ký
          </button>
        </div>
      </nav>

      <div className="form-box">
        <div className="register-container" id="register">
          <div className="top">
            <span>
              Đã có tài khoản?{" "}
              <a href="#" onClick={() => navigate("/login")}>
                Đăng nhập
              </a>
            </span>
            <header>ĐĂNG KÝ</header>
          </div>
          <div className="input-box">
            <input type="text" className="input-field" placeholder="Tên đăng nhập" />
            <i className="bx bx-envelope"></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              className="input-field"
              placeholder="Mật khẩu"
            />
            <i className="bx bx-lock-alt"></i>
          </div>
          <div className="input-box">
            <input type="submit" className="submit" value="Đăng ký" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
