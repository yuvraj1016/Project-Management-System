import React, { useState } from "react";
import axios from "axios";
import "./Search.css";

export default function Search() {
    const [projects, setProjects] = useState([]);
    const [type, setType] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        let url = "";
        let body = {};

        switch (type) {
            case "Roll":
                url = "https://project-management-system-a4in.onrender.com/api/v1/post/search-roll";
                body = { rollno: searchValue };
                break;
            case "Supervisor":
                url = "https://project-management-system-a4in.onrender.com/api/v1/post/search-supervisor";
                body = { supname: searchValue };
                break;
            case "Semester":
                url = "https://project-management-system-a4in.onrender.com/api/v1/post/search-semester";
                body = { sem: searchValue };
                break;
            case "Year":
                url = "https://project-management-system-a4in.onrender.com/api/v1/post/search-year";
                body = { Year: searchValue };
                break;
            default:
                setError("Please select a search type");
                setIsLoading(false);
                return;
        }

        try {
            const res = await axios.post(url, body);
            setProjects(res.data.project);
        } catch (err) {
            console.error(err);
            setError("An error occurred while fetching the data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const updateView = async (id, view) => {
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
    };

    return (
        <div className="search-container">
            <h2 className="search-title">Search Projects</h2>
            <form className="search-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="search-type">Search Type:</label>
                    <select 
                        id="search-type"
                        value={type} 
                        onChange={(e) => {
                            setType(e.target.value);
                            setSearchValue('');
                        }} 
                        required
                    >
                        <option value="">Choose the type of search</option>
                        <option value="Roll">Search By Roll</option>
                        <option value="Supervisor">Search By Supervisor Name</option>
                        <option value="Semester">Search By Semester</option>
                        <option value="Year">Search by Year</option>
                    </select>
                </div>
                {type && (
                    <div className="form-group">
                        <label htmlFor="search-value">Enter {type}:</label>
                        <input
                            id="search-value"
                            type={type === "Roll" || type === "Semester" || type === "Year" ? "tel" : "text"}
                            pattern={
                                type === "Roll" ? "[0-9]{8}" :
                                type === "Semester" ? "[1-8]{1}" :
                                type === "Year" ? "[1-4]{1}" : undefined
                            }
                            placeholder={`Enter ${type}`}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            required
                            minLength={type === "Roll" ? 8 : type === "Semester" || type === "Year" ? 1 : undefined}
                            maxLength={type === "Roll" ? 8 : type === "Semester" || type === "Year" ? 1 : 25}
                        />
                    </div>
                )}
                <button type="submit" className="search-button" disabled={isLoading}>
                    {isLoading ? "Searching..." : "Search"}
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
            <div className="project-grid">
                {projects.map((item) => (
                    <div className="project-card" key={item._id}>
                        <div className="project-header">
                            <h3 onClick={() => updateView(item._id, item.viewed)}>
                                {item.projectName}
                            </h3>
                            <img
                                className="project-image"
                                src={`data:${item.projectImage.contentType};base64,${btoa(String.fromCharCode(...new Uint8Array(item.projectImage.data.data)))}`}
                                alt={item.projectName}
                            />
                        </div>
                        <div className="project-body">
                            <div className="project-info">
                                <p><strong>Submitted by:</strong> {item.firstName} {item.lastName}</p>
                                <p><strong>Roll:</strong> {item.rollNumber}</p>
                                <p><strong>Year:</strong> {item.year}th</p>
                                <p><strong>Semester:</strong> {item.semester}th</p>
                            </div>
                            <div className="project-description">
                                <h4>Description</h4>
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
                ))}
            </div>
        </div>
    );
}

