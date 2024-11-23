import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Supervisor.css";

export default function Supervisor({ data }) {
  const [students, setStudents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const projectUrl = "https://project-management-system-a4in.onrender.com/api/v1/post/getprof-post";
        const studentUrl = "https://project-management-system-a4in.onrender.com/api/v1/user/get";

        const [projectRes, studentRes] = await Promise.all([
          axios.post(projectUrl, { email: data.email }),
          axios.post(studentUrl, { sup: data.email })
        ]);

        setProjects(projectRes.data.project);
        setStudents(studentRes.data.user);
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [data.email]);

  const getProjectDetails = (studentId) => {
    const project = projects.find(p => p.user === studentId);
    return project ? { name: project.projectName, status: project.status || "Pending" } : { name: "Not found", status: "Pending" };
  };

  const renderStudentTable = (year) => (
    <div className="student-table-container">
      <h2>{year === 3 ? "3rd" : "4th"} Year Students</h2>
      <div className="table-responsive">
        <table className="student-table">
          <thead>
            <tr>
              <th>Student's Name</th>
              <th>Roll</th>
              <th>Project Name</th>
              <th>Project Status</th>
            </tr>
          </thead>
          <tbody>
            {students.filter(student => student.year === year).map((student) => {
              const projectDetails = getProjectDetails(student._id);
              return (
                <tr key={student._id}>
                  <td>{`${student.firstName} ${student.lastName}`}</td>
                  <td>{student.rollNumber}</td>
                  <td>{projectDetails.name}</td>
                  <td>
                    <span className={`status-badge ${projectDetails.status.toLowerCase()}`}>
                      {projectDetails.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="loading">Loading student and project data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="supervisor-dashboard">
      <h1>Supervisor Dashboard</h1>
      {renderStudentTable(3)}
      {renderStudentTable(4)}
    </div>
  );
}

