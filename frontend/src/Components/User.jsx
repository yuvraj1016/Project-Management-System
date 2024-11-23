import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Projectcard from "./Projectcard";
import Search from "./Search";
import Notification from "./Notification";
import Mypost from "./Mypost";
import "./User.css";

export default function User() {
  const userId = Cookies.get("UserId");
  const navigate = useNavigate();
  const [userdata, setUserData] = useState({});
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [file, setFile] = useState(null);
  const [domain, setDomain] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [flag, setFlag] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const url = "https://project-management-system-a4in.onrender.com/api/v1/user/user-details";
        const res = await axios.post(url, { id: userId });
        setUserData(res.data.userDetails);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const projectData = new FormData();
    projectData.append("Name", projectName);
    projectData.append("desc", projectDescription);
    if (file) projectData.append("projectFile", file);
    projectData.append("domain", domain);
    if (selectedImage) projectData.append("projectImage", selectedImage);
    projectData.append("id", userId);
    projectData.append("status", "Submitted");

    try {
      const url = "https://project-management-system-a4in.onrender.com/api/v1/post/post-entry";
      const res = await axios.post(url, projectData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!res.data.flag) {
        alert("Project Submitted");
        setShowProjectForm(false);
        window.location.reload();
      } else {
        setFlag(res.data.flag);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    Cookies.remove("auth");
    Cookies.remove("UserId");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="user-container">
      <header className="user-header">
        <div className="user-info">
          <div className="user-avatar">
            {userdata.photo && (
              <img
                src={`data:${userdata.photo.contentType};base64,${btoa(
                  String.fromCharCode(...new Uint8Array(userdata.photo.data.data))
                )}`}
                alt={`${userdata.first} ${userdata.last}`}
              />
            )}
          </div>
          <span>{userdata.first} {userdata.last}</span>
        </div>
      </header>

      <main className="user-main">
        <nav className="user-tabs">
          <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>Dashboard</button>
          <button className={activeTab === "search" ? "active" : ""} onClick={() => setActiveTab("search")}>Search</button>
          <button className={activeTab === "myProjects" ? "active" : ""} onClick={() => setActiveTab("myProjects")}>My Projects</button>
          <button className={activeTab === "notifications" ? "active" : ""} onClick={() => setActiveTab("notifications")}>Notifications</button>
        </nav>

        <section className="user-content">
          {activeTab === "dashboard" && (
            <div className="dashboard">
              <h2>Dashboard</h2>
              {new Date(userdata?.submissionDate) > new Date() && (
                <div className="project-submission">
                  <button className="create-project-btn" onClick={() => setShowProjectForm(!showProjectForm)}>
                    Create New Project
                  </button>
                  <p className="deadline">
                    Deadline: {new Date(userdata.submissionDate).toLocaleDateString()}
                  </p>
                  <p className="warning">
                    Please submit before the deadline or the portal will be closed.
                  </p>
                </div>
              )}
              {showProjectForm && (
                <form onSubmit={handleSubmit} className="project-form">
                  {flag && <p className="error">Change your Project name</p>}
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    maxLength={30}
                    required
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                    required
                  />
                  <textarea
                    placeholder="Project Description"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    maxLength={200}
                  />
                  <input
                    type="file"
                    accept=".docx, application/pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                  />
                  <select value={domain} onChange={(e) => setDomain(e.target.value)} required>
                    <option value="">Select Domain</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Web Development">Web Development</option>
                    <option value="App Development">App Development</option>
                    <option value="Networking">Networking</option>
                    <option value="Cyber Security">Cyber Security</option>
                  </select>
                  <button type="submit">Submit Project</button>
                </form>
              )}
              <h3>Your Projects</h3>
              <Projectcard />
            </div>
          )}
          {activeTab === "search" && <Search />}
          {activeTab === "myProjects" && <Mypost Id={userId} />}
          {activeTab === "notifications" && <Notification />}
        </section>
      </main>

      <footer className="user-footer">
        <p>&copy; 2023 Project Management System. All rights reserved.</p>
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
      </footer>
    </div>
  );
}

