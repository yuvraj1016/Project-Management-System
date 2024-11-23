import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import "./Notification.css";

export default function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState("unread");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userId = Cookies.get("UserId");
        const fetchNotifications = async () => {
            try {
                const url = `https://project-management-system-a4in.onrender.com/api/v1/notification/get-notification`;
                const response = await axios.post(url, { user: userId });
                setNotifications(response.data.notification);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const updateNotification = async (id) => {
        try {
            const url = `https://project-management-system-a4in.onrender.com/api/v1/notification/update-notification`;
            await axios.post(url, { Id: id });
            setNotifications(prevNotifications =>
                prevNotifications.map(notification =>
                    notification._id === id ? { ...notification, read: true } : notification
                )
            );
        } catch (error) {
            console.error("Error updating notification:", error);
        }
    };

    const unreadNotifications = notifications.filter(n => !n.read);
    const readNotifications = notifications.filter(n => n.read);

    return (
        <div className="notification-container">
            <div className="notification-header">
                <h2>Notifications</h2>
                <p>Stay updated with your latest notifications</p>
            </div>
            <div className="notification-tabs">
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
            <div className="notification-content">
                {isLoading ? (
                    <div className="loading">Loading notifications...</div>
                ) : (
                    <div className="notification-list">
                        {activeTab === "unread" ? (
                            unreadNotifications.length > 0 ? (
                                unreadNotifications.map(notification => (
                                    <div 
                                        key={notification._id} 
                                        className="notification-item unread"
                                        onClick={() => updateNotification(notification._id)}
                                    >
                                        <span className="notification-icon">📩</span>
                                        <p>{notification.body}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="no-notifications">No unread notifications</p>
                            )
                        ) : (
                            readNotifications.length > 0 ? (
                                readNotifications.map(notification => (
                                    <div key={notification._id} className="notification-item read">
                                        <span className="notification-icon">✉️</span>
                                        <p>{notification.body}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="no-notifications">No read notifications</p>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

