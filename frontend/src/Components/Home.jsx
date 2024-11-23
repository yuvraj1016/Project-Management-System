import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [userRoll, setUserRoll] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("student");
  const [profMail, setProfMail] = useState("");
  const [flag, setFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const url = userType === 'student'
      ? "https://project-management-system-a4in.onrender.com/api/v1/user/user-login"
      : "https://project-management-system-a4in.onrender.com/api/v1/professor/professor-login";
    const body = userType === 'student'
      ? { roll: userRoll, pass: password }
      : { email: profMail, pass: password };

    try {
      const res = await axios.post(url, body);
      if (!res.data.flag) {
        Cookies.set(userType === 'student' ? "auth" : "profauth", true, { expires: 2 });
        Cookies.set("UserId", res.data.User, { expires: 2 });
        navigate(userType === 'student' ? '/user' : '/prof');
        window.location.reload();
      } else {
        setFlag(res.data.flag);
      }
    } catch (err) {
      console.error(err);
      setFlag(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="home">
      <main className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          {flag && (
            <p className="error-message">
              User doesn't exist. <Link to="/signup">Sign up</Link> to create a new account.
            </p>
          )}
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                value="student"
                checked={userType === "student"}
                onChange={() => setUserType("student")}
              />
              <span>Student</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="professor"
                checked={userType === "professor"}
                onChange={() => setUserType("professor")}
              />
              <span>Professor</span>
            </label>
          </div>
          <div className="form-group">
            <label htmlFor={userType === "professor" ? "profEmail" : "userRoll"}>
              {userType === "professor" ? "Email:" : "Roll Number:"}
            </label>
            <input
              type={userType === "professor" ? "email" : "tel"}
              id={userType === "professor" ? "profEmail" : "userRoll"}
              placeholder={userType === "professor" ? "Email" : "Roll Number"}
              value={userType === "professor" ? profMail : userRoll}
              onChange={(e) => userType === "professor" ? setProfMail(e.target.value) : setUserRoll(e.target.value)}
              pattern={userType === "student" ? "[0-9]{8}" : undefined}
              minLength={userType === "student" ? 8 : undefined}
              maxLength={userType === "student" ? 8 : undefined}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <div className="signup-cont">
          <h3>New user?</h3>
          <button className="signup-btn" onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </main>
      <footer className="foot-container">
        <p>&copy; 2023 Project Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

