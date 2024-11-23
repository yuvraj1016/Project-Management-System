import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import "./Profnoti.css";

export default function Profnoti() {
    const userId = Cookies.get("UserId");
    const [notifications, setNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState("unread");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const url = `https://project-management-system-a4in.onrender.com/api/v1/notification/prof-notification`;
                const response = await axios.post(url, { user: userId });
                setNotifications(response.data.notification);
            } catch (err) {
                console.error("Error fetching notifications:", err);
                setError("Failed to load notifications. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, [userId]);

    const updateNotification = async (id) => {
        try {
            const url = `https://project-management-system-a4in.onrender.com/api/v1/notification/update-notification`;
            await axios.post(url, { Id: id });
            setNotifications(prevNotifications =>
                prevNotifications.map(notification =>
                    notification._id === id ? { ...notification, read: true } : notification
                )
            );
        } catch (err) {
            console.error("Error updating notification:", err);
        }
    };

    const unreadNotifications = notifications.filter(notification => !notification.read);
    const readNotifications = notifications.filter(notification => notification.read);

    if (isLoading) {
        return <div className="loading">Loading notifications...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="profnoti-container">
            <h2 className="profnoti-title">Notifications</h2>
            <div className="profnoti-tabs">
                <button
                    className={`tab-button ${activeTab === "unread" ? "active" : ""}`}
                    onClick={() => setActiveTab("unread")}
                >
                    Unread ({unreadNotifications.length})
                </button>
                <button
                    className={`tab-button ${activeTab === "read" ? "active" : ""}`}
                    onClick={() => setActiveTab("read")}
                >
                    Read ({readNotifications.length})
                </button>
            </div>
            <div className="notifications-list">
                {activeTab === "unread" ? (
                    unreadNotifications.length > 0 ? (
                        unreadNotifications.map((item) => (
                            <div
                                key={item._id}
                                className="notification-item unread"
                                onClick={() => updateNotification(item._id)}
                            >
                                <span className="notification-icon">🔔</span>
                                <p>{item.body}</p>
                            </div>
                        ))
                    ) : (
                        <p className="no-notifications">No unread notifications</p>
                    )
                ) : (
                    readNotifications.length > 0 ? (
                        readNotifications.map((item) => (
                            <div key={item._id} className="notification-item read">
                                <span className="notification-icon">✉️</span>
                                <p>{item.body}</p>
                            </div>
                        ))
                    ) : (
                        <p className="no-notifications">No read notifications</p>
                    )
                )}
            </div>
        </div>
    );
}

