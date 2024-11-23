import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./Profprojectcard.css";

export default function Profprojectcard({ data }) {
  const userId = Cookies.get("UserId");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const url = "https://project-management-system-a4in.onrender.com/api/v1/post/getprof-post";
        const response = await axios.post(url, { email: data.email });
        setProjects(response.data.project);
      } catch (err) {
        console.error(err);
        setError("Failed to load projects. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [data.email]);

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

  const updateGrade = async (e, id, grade) => {
    e.preventDefault();
    try {
      const url = `https://project-management-system-a4in.onrender.com/api/v1/post/update-grade`;
      await axios.get(url, { params: { userid: id, Grade: grade } });
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project._id === id ? { ...project, grade } : project
        )
      );
      const project = projects.find(p => p._id === id);
      await sendNotification(project.user, project.firstName, project.lastName, project.rollNumber, grade);
    } catch (err) {
      console.error(err);
    }
  };

  const sendNotification = async (id, first, last, roll, grade) => {
    try {
      const url = `https://project-management-system-a4in.onrender.com/api/v1/notification/add-notification`;
      const body = {
        To: id,
        From: userId,
        Body: `${first} ${last} (Roll ${roll}), your project has been graded ${grade} by Dr. ${data.first} ${data.last}`
      };
      await axios.post(url, body);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="profprojectcard">
      <h2>Projects to Grade</h2>
      {projects.filter(item => !item.grade).length === 0 ? (
        <p className="no-projects">No projects to grade at the moment.</p>
      ) : (
        projects.filter(item => !item.grade).map((item) => (
          <div className="project-container" key={item._id}>
            <div className="project-header">
              <h3 onClick={() => updateView(item._id, item.viewed)}>{item.projectName}</h3>
              <img
                className="project-image"
                src={`data:${item.projectImage.contentType};base64,${btoa(String.fromCharCode(...new Uint8Array(item.projectImage.data.data)))}`}
                alt={item.projectName}
              />
            </div>
            <div className="project-details">
              <div className="project-info">
                <p><strong>Submitted by:</strong> {item.firstName} {item.lastName}</p>
                <p><strong>Roll:</strong> {item.rollNumber}</p>
                <p><strong>Year:</strong> {item.year}th</p>
                <p><strong>Semester:</strong> {item.semester}th</p>
                <p><strong>Views:</strong> {item.viewed}</p>
              </div>
              <div className="project-description">
                <h4>Description</h4>
                <p>{item.projectDescription}</p>
              </div>
              <form className="grade-form" onSubmit={(e) => updateGrade(e, item._id, e.target.grade.value)}>
                <label htmlFor={`grade-${item._id}`}>Grade the Project:</label>
                <select id={`grade-${item._id}`} name="grade" required>
                  <option value="">Select Grade</option>
                  {["AA", "AB", "BB", "BC", "CC", "CD", "DD", "FF", "I"].map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
                <button type="submit">Add Grade</button>
              </form>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

