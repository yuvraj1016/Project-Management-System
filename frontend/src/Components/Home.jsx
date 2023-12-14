import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link, Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Cookies from "js-cookie";


export default function Home() {
    const navigate = useNavigate();
    const [userRoll, setUserRoll] = useState(null);
    const [password, setPassWord] = useState(null);
    const [userType, setUserType] = useState("student");
    const [profMail, setProfMail] = useState('');
    const [flag, setFlag] = useState(false);
    

    async function handleSubmit(e) {
        e.preventDefault();
        if (userType === 'student') {
            const url = "http://localhost:3001/api/v1/user/user-login";
            const body = {
                roll: userRoll,
                pass: password
            }
            await axios.post(url, body)
                .then((res) => {
                    if (!res.data.flag) {
                        Cookies.set("auth", true, { expires: 2 });
                        Cookies.set("UserId",res.data.User,{ expires: 2 });
                        navigate('/user');
                        window.location.reload();
                    } else {
                        setFlag(res.data.flag);
                    }
                }).catch((err) => {
                    console.log(err);
                })
        } else {
            const url = "http://localhost:3001/api/v1/professor/professor-login";
            const body = {
                email: profMail,
                pass: password
            };
            await axios.post(url, body)
                .then((res) => {
                    if (!res.data.flag) {
                        Cookies.set("profauth", true, { expires: 2 });
                        Cookies.set("UserId",res.data.User,{ expires: 2 });
                        navigate('/prof');
                        window.location.reload();
                    } else {
                        setFlag(res.data.flag);
                    }
                }).catch((err) => {
                    console.log(err);
                });
        }

    }

    return (
        <div className="home">
            <header className="head-container">
                <h1>Project Management System</h1>
            </header>
            <div className="login-container">
                <form className="login-form" onSubmit={(e) => handleSubmit(e)}>
                    {flag && <Link to="/signup" style={{ color: "red" }}>The User Doesn't Exists click Sign Up to create a new User</Link>}
                    <div>
                        <label>
                            <input
                                type="radio"
                                value="student"
                                checked={userType === "student"}
                                onChange={() => setUserType("student")}
                            />
                            Student
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="professor"
                                checked={userType === "professor"}
                                onChange={() => setUserType("professor")}
                            />
                            Professor
                        </label>
                    </div>
                    {userType === "professor" ? (
                        <>
                            <label for="prof Email">Email:</label>
                            <input
                                type="email"
                                placeholder="Email"
                                value={profMail}
                                onChange={(e) => setProfMail(e.target.value)}
                            />
                        </>
                    ) : (
                        <>
                            <label for="prof Email">Roll Number : </label>
                            <input
                                type="tel"
                                pattern="[0-9]{8}"
                                placeholder="Roll Number"
                                value={userRoll}
                                minLength={8}
                                maxLength={8}
                                onChange={(e) => setUserRoll(e.target.value)}
                            />
                        </>
                    )}
                    <label for="Password">Password: </label>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassWord(e.target.value)}
                    />
                    <input type="submit" value="Log In" />
                </form>
                <div className="signup-cont">
                    <h3>If you are a new user, please sign up first</h3>
                    <button id="Signup" onClick={() => navigate('/signup')}>Sign Up</button>
                </div>
            </div>
            <footer className="foot-container">
                <h1></h1>
            </footer>
        </div>
    );
}
