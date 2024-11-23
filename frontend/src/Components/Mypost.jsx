import axios from "axios";
import { useState, useEffect } from "react";
import "./Mypost.css";

export default function Mypost({ Id }) {
    const [projects, setProjects] = useState([]);
    const [visibleProjects, setVisibleProjects] = useState(3);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const url = "https://project-management-system-a4in.onrender.com/api/v1/post/user-post";
                const res = await axios.post(url, { id: Id });
                setProjects(res.data.project);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch projects. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, [Id]);

    async function updateView(id, view) {
        const params = {
            userid: id,
            viewed: view + 1,
        };
        const url = `https://project-management-system-a4in.onrender.com/api/v1/post/update-views`;
        try {
            await axios.get(url, { params });
            setProjects(prevProjects =>
                prevProjects.map(project =>
                    project._id === id ? { ...project, viewed: view + 1 } : project
                )
            );
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="mypost-container">
            <h2 className="mypost-title">My Projects</h2>
            {isLoading && <p>Loading your projects...</p>}
            {error && <p className="error-message">{error}</p>}
            {!isLoading && !error && projects.length === 0 && <p>You haven't submitted any projects yet.</p>}
            <div className="project-grid">
                {projects.slice(0, visibleProjects).map((item) => (
                    <div className="project-card" key={item._id}>
                        <div className="project-image-container">
                            <img
                                className="project-image"
                                src={`data:${item.projectImage.contentType};base64,${btoa(String.fromCharCode(...new Uint8Array(item.projectImage.data.data)))}`}
                                alt={item.projectName}
                            />
                        </div>
                        <div className="project-content">
                            <h3 className="project-name">{item.projectName}</h3>
                            <p className="project-description">{item.projectDescription}</p>
                            <div className="project-meta">
                                <span className="project-views">Views: {item.viewed}</span>
                                {item.grade && <span className="project-grade">Grade: {item.grade}</span>}
                            </div>
                            <p className="project-supervisor">Submitted To: {item.supervisorName}</p>
                            <a href={`mailto:${item.supervisorEmail}`} className="project-email">
                                {item.supervisorEmail}
                            </a>
                            <button className="view-details-btn" onClick={() => updateView(item._id, item.viewed)}>
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {visibleProjects < projects.length && (
                <div className="load-more-container">
                    <button className="load-more-btn" onClick={() => setVisibleProjects(prev => prev + 3)}>
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
}

