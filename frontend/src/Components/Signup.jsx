import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        roll: "",
        password: "",
        email: "",
        year: "",
        section: "",
        semester: "",
        first: "",
        last: "",
        userType: "student",
        branch: "",
        department: "",
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [flag, setFlag] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const selectFile = (e) => {
        const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        setSelectedImage(files[0]);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        const userData = new FormData();
        Object.keys(formData).forEach(key => userData.append(key, formData[key]));
        userData.append("userImage", selectedImage);

        const url = `https://project-management-system-a4in.onrender.com/api/v1/${formData.userType}/${formData.userType}-signup`;

        try {
            const res = await axios.post(url, userData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (!res.data.flag) {
                alert("You are being redirected to homepage. Please login using your credentials.");
                navigate('/');
                window.location.reload();
            } else {
                setFlag(res.data.flag);
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred during signup. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="signup-page">
            <main className="main-content">
                <form className="signup-form" onSubmit={handleSubmit}>
                    <h2>Sign Up</h2>
                    {flag && <p className="error-message">User already exists. <Link to="/">Login here</Link></p>}
                    <div className="form-group radio-group">
                        <label>
                            <input
                                type="radio"
                                name="userType"
                                value="student"
                                checked={formData.userType === "student"}
                                onChange={handleChange}
                            />
                            <span>Student</span>
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="userType"
                                value="professor"
                                checked={formData.userType === "professor"}
                                onChange={handleChange}
                            />
                            <span>Professor</span>
                        </label>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="first">First Name</label>
                            <input type="text" id="first" name="first" placeholder="First name" value={formData.first} maxLength={10} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="last">Last Name</label>
                            <input type="text" id="last" name="last" placeholder="Last name" value={formData.last} maxLength={10} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">College Email ID</label>
                        <input type="email" id="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    </div>
                    {formData.userType === 'student' ? (
                        <>
                            <div className="form-group">
                                <label htmlFor="roll">Roll Number</label>
                                <input type="tel" id="roll" name="roll" pattern="[0-9]{8}" placeholder="Roll Number (e.g., 21010123)" value={formData.roll} minLength={8} maxLength={8} onChange={handleChange} required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="year">Year</label>
                                    <input type="tel" id="year" name="year" pattern="[1-4]{1}" placeholder="Year" value={formData.year} minLength={1} maxLength={1} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="semester">Semester</label>
                                    <input type="tel" id="semester" name="semester" pattern="[1-8]{1}" placeholder="Semester" value={formData.semester} minLength={1} maxLength={1} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="section">Section</label>
                                    <input type="text" id="section" name="section" placeholder="Section" value={formData.section} minLength={1} maxLength={1} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="branch">Branch</label>
                                <select id="branch" name="branch" value={formData.branch} onChange={handleChange} required>
                                    <option value="">Select Branch</option>
                                    <option value="CSE">CSE</option>
                                    <option value="ECE">ECE</option>
                                    <option value="CSE_AI">CSE (AI)</option>
                                    <option value="ECE_VLSI">ECE (VLSI)</option>
                                </select>
                            </div>
                        </>
                    ) : (
                        <div className="form-group">
                            <label htmlFor="department">Department</label>
                            <select id="department" name="department" value={formData.department} onChange={handleChange} required>
                                <option value="">Select Department</option>
                                <option value="CSE">CSE</option>
                                <option value="ECE">ECE</option>
                            </select>
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Photo</label>
                        <input type="file" id="image" accept="image/*" onChange={selectFile} required />
                    </div>
                    <button type="submit" className="submit-btn" disabled={isLoading}>
                        {isLoading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>
            </main>
            <footer className="footer">
                <p>&copy; 2023 Project Management System. All rights reserved.</p>
            </footer>
        </div>
    );
}

