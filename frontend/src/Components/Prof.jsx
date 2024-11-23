import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Profprojectcard from "./Profprojectcard";
import Projectcard from "./Projectcard";
import Gradecard from "./Gradecard";
import Search from "./Search";
import Profnoti from "./Profnoti";
import Admin from "./Admin";
import Coordinator from "./Coordinator";
import Supervisor from "./Supervisor";
import "./Prof.css";

export default function Prof() {
    const userId = Cookies.get("UserId");
    const navigate = useNavigate();
    const [userdata, setUserData] = useState({});
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const url = "https://project-management-system-a4in.onrender.com/api/v1/professor/prof-details";
                const response = await axios.post(url, { id: userId });
                setUserData(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleLogout = () => {
        Cookies.remove("profauth");
        Cookies.remove("UserId");
        navigate('/');
    };

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <Projectcard />;
            case "search":
                return <Search />;
            case "supervisor":
                return <Supervisor data={userdata.userDetails} />;
            case "submitted":
                return <Profprojectcard data={userdata.userDetails} />;
            case "graded":
                return <Gradecard data={userdata.userDetails} />;
            case "notifications":
                return <Profnoti />;
            case "admin":
                return userdata.userDetails?.isAdmin ? <Admin /> : null;
            case "coordinator":
                return userdata.userDetails?.isCoordinator ? <Coordinator data={userdata.userDetails} /> : null;
            default:
                return null;
        }
    };

    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="prof-container">
            <header className="prof-header">
                <div className="user-info">
                    <img
                        className="user-avatar"
                        src={`data:${userdata.userDetails.photo.contentType};base64,${btoa(String.fromCharCode(...new Uint8Array(userdata.userDetails.photo.data.data)))}`}
                        alt={`${userdata.userDetails.first} ${userdata.userDetails.last}`}
                    />
                    <span>{userdata.userDetails.first} {userdata.userDetails.last}</span>
                </div>
            </header>

            <div className="prof-content">
                <nav className="prof-sidebar">
                    <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>Dashboard</button>
                    <button className={activeTab === "search" ? "active" : ""} onClick={() => setActiveTab("search")}>Search</button>
                    <button className={activeTab === "supervisor" ? "active" : ""} onClick={() => setActiveTab("supervisor")}>Supervisor Panel</button>
                    <button className={activeTab === "submitted" ? "active" : ""} onClick={() => setActiveTab("submitted")}>Submitted Projects</button>
                    <button className={activeTab === "graded" ? "active" : ""} onClick={() => setActiveTab("graded")}>Graded Projects</button>
                    <button className={activeTab === "notifications" ? "active" : ""} onClick={() => setActiveTab("notifications")}>Notifications</button>
                    {userdata.userDetails?.isAdmin && (
                        <button className={activeTab === "admin" ? "active" : ""} onClick={() => setActiveTab("admin")}>Admin Panel</button>
                    )}
                    {userdata.userDetails?.isCoordinator && (
                        <button className={activeTab === "coordinator" ? "active" : ""} onClick={() => setActiveTab("coordinator")}>Coordinator Panel</button>
                    )}
                    <button className="logout-btn" onClick={handleLogout}>Log Out</button>
                </nav>

                <main className="prof-main">
                    {renderContent()}
                </main>
            </div>

            <footer className="prof-footer">
                <p>&copy; 2023 Project Management System. All rights reserved.</p>
            </footer>
        </div>
    );
}

