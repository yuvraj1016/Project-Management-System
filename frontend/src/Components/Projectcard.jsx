import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Projectcard.css";

export default function Projectcard() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const url = "https://project-management-system-a4in.onrender.com/api/v1/post/get-post";
                const res = await axios.get(url);
                setProjects(res.data.project);
            } catch (err) {
                console.error(err);
                setError("Failed to load projects. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const updateView = async (id, view) => {
        try {
            const url = `https://project-management-system-a4in.onrender.com/api/v1/post/update-views`;
            await axios.get(url, { params: { userid: id, viewed: view + 1 } });
            setProjects(prevProjects =>
                prevProjects.map(project =>
                    project._id === id ? { ...project, viewed: view + 1 } : project
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) {
        return <div className="loading">Loading projects...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="project-grid">
            {projects.length > 0 ? (
                projects.map((item) => (
                    <div className="project-card" key={item._id}>
                        <div className="project-header" onClick={() => updateView(item._id, item.viewed)}>
                            <h2 className="project-title">{item.projectName}</h2>
                            <img
                                className="project-image"
                                src={`data:${item.projectImage.contentType};base64,${btoa(String.fromCharCode(...new Uint8Array(item.projectImage.data.data)))}`}
                                alt={item.projectName}
                            />
                        </div>
                        <div className="project-content">
                            <div className="project-info">
                                <p><strong>Submitted by:</strong> {item.firstName} {item.lastName}</p>
                                <p><strong>Roll:</strong> {item.rollNumber}</p>
                                <p><strong>Year:</strong> {item.year}th</p>
                                <p><strong>Semester:</strong> {item.semester}th</p>
                            </div>
                            <div className="project-description">
                                <h3>Description</h3>
                                <p>{item.projectDescription}</p>
                            </div>
                            <div className="project-meta">
                                <p><strong>Views:</strong> {item.viewed}</p>
                                {item.grade && <p><strong>Grade:</strong> {item.grade}</p>}
                                <p><strong>Submitted To:</strong> {item.supervisorName}</p>
                                <p><strong>Supervisor Email:</strong> <a href={`mailto:${item.supervisorEmail}`}>{item.supervisorEmail}</a></p>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="no-projects">No projects available.</div>
            )}
        </div>
    );
}

