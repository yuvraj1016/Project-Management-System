import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();
    const [roll, setRoll] = useState(null);
    const [password, setPassWord] = useState('');
    const [email, setEmail] = useState('');
    const [year, setYear] = useState(null);
    const [section, setSection] = useState('');
    const [semester,setSemester] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [userType, setUserType] = useState("student");
    const [branch, setBranch] = useState('');
    const [department, setDepartMent] = useState('');
    const [flag, setFlag] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        const userData = new FormData();
        userData.append("userImage", selectedImage);
        userData.append("passWord", password);
        userData.append("emailId", email);
        userData.append("firstName", first);
        userData.append("lastName", last);
        if (userType === "student") {
            userData.append("rollNumber", roll);
            userData.append("Year", year);
            userData.append("semester",semester)
            userData.append("sec", section);
            userData.append("branch", branch);
            const url = "http://localhost:3001/" + "api/v1/user/user-signup";
            console.log(url);
            axios.post(url, userData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                if (!res.data.flag) {
                    alert("You are being redirected to homepage now login using your credentials");
                    navigate('/');
                    window.location.reload();
                } else {
                    setFlag(res.data.flag);
                }
            }).catch((err) => {
                console.log(err);
            });
        } else {
            userData.append("dept", department);
            const url = "http://localhost:3001/" + "api/v1/professor/professor-signup";
            console.log(url);
            axios.post(url, userData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                if (!res.data.flag) {
                    alert("You are being redirected to homepage now login using your credentials");
                    navigate('/');
                    window.location.reload();
                } else {
                    setFlag(res.data.flag);
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    }
    const selectFile = (e) => {
        const files = e.dataTransfer
            ? e.dataTransfer.files
            : e.target.files;
        setSelectedImage(files[0]);
    }


    return (
        <div className="home">
            <header className="head-container">
                <h1>Project Management System</h1>
            </header>
            <div className="signup-container">
                <form className="signup-form" onSubmit={(e) => handleSubmit(e)}>
                    {flag && <Link to="/" style={{ color: "red" }}>User Already exists click here to go to Login page and login</Link>}
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
                    <div>
                        <label for="first" style={{ margin: "2vh" }}>First Name : </label>
                        <input type="text" placeholder="First name" value={first} maxLength={10} onChange={(e) => setFirst(e.target.value)} required="required" />
                        <label for="first" style={{ margin: "2vh" }}>Last Name : </label>
                        <input type="text" placeholder="Last name" value={last} maxLength={10} onChange={(e) => setLast(e.target.value)} required="required" />
                    </div>
                    <label for="StudentEmail" >College EmailId : </label>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required="required" />
                    {
                        userType === 'student' ? (
                            <>
                                <label for="Phone">Roll Number : Example 21010123 </label>
                                <input type="tel" pattern="[0-9]{8}" placeholder="Roll Number" value={roll} minLength={8} maxLength={8} onChange={(e) => setRoll(e.target.value)} required="required" />
                                <label for="Phone">Year : </label>
                                <input type="tel" pattern="[1-4]{1}" placeholder="Year" value={year} minLength={1} maxLength={1} onChange={(e) => setYear(e.target.value)} required="required" />
                                <label for="sem">Semester : </label>
                                <input type="tel" pattern="[1-8]{1}" placeholder="Semester" value={semester} minLength={1} maxLength={1} onChange={(e) => setSemester(e.target.value)} required="required" />
                                <label for="section">Section : </label>
                                <input type="text" placeholder="Section" value={section} minLength={1} maxLength={1} onChange={(e) => setSection(e.target.value)} required="required" />
                                <label for="branch">Branch: </label>
                                <select value={branch} onChange={(e) => setBranch(e.target.value)} required="required" >
                                    <option value="">Select Branch</option>
                                    <option value="CSE">CSE</option>
                                    <option value="ECE">ECE</option>
                                    <option value="CSE_AI">CSE (AI)</option>
                                    <option value="ECE_VLSI">ECE (VLSI)</option>
                                </select>
                            </>
                        ) : (
                            <>
                                <label for="branch">Department </label>
                                <select value={department} onChange={(e) => setDepartMent(e.target.value)} required="required">
                                    <option value="">Select Department</option>
                                    <option value="CSE">CSE</option>
                                    <option value="ECE">ECE</option>
                                </select>
                            </>
                        )
                    }
                    <label for="Password">PassWord : </label>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassWord(e.target.value)} required="required" />
                    <label for="image" >Photo : </label>
                    <input type="file" accept="image/*" onChange={(e) => selectFile(e)} required="required" />
                    <input type="submit" value="Sign Up" />
                </form>
            </div>
            <footer className="foot-container">
                <h1>Author : Yuvraj Singh</h1>
            </footer>
        </div>
    )
}



