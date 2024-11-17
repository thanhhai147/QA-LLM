import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="wrapper">
      <nav className="nav">
        <div className="nav-logo">
          <p>Héloooooooo!</p>
        </div>
        <div className="nav-button">
          <button className="btn white-btn" id="loginBtn">
            Đăng nhập
          </button>
          <button
            className="btn"
            id="registerBtn"
            onClick={() => navigate("/signup")}
          >
            Đăng ký
          </button>
        </div>
      </nav>

      <div className="form-box">
        <div className="login-container" id="login">
          <div className="top">
            <span>
              Bạn chưa có tài khoản?{" "}
              <a href="#" onClick={() => navigate("/signup")}>
                Đăng ký
              </a>
            </span>
            <header>ĐĂNG NHẬP</header>
          </div>
          <div className="input-box">
            <input
              type="text"
              className="input-field"
              placeholder="Tên đăng nhập"
            />
            <i className="bx bx-user"></i>
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
            <input type="submit" className="submit" value="Đăng nhập" />
          </div>
          <div className="two-col">
            <div className="one">
              <input type="checkbox" id="login-check" />
              <label htmlFor="login-check"> Ghi nhớ đăng nhập</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
