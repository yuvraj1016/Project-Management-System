import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Coordinator.css";

export default function Coordinator({ data }) {
  const [students, setStudents] = useState([]);
  const [profList, setProfList] = useState([]);
  const [date3, setDate3] = useState(null);
  const [date4, setDate4] = useState(null);
  const [supervisor, setSupervisor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, profsRes] = await Promise.all([
          axios.get("https://project-management-system-a4in.onrender.com/api/v1/user/getall"),
          axios.get("https://project-management-system-a4in.onrender.com/api/v1/professor/get-all")
        ]);
        setStudents(studentsRes.data.user);
        setProfList(profsRes.data.prof);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = async (e, id) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://project-management-system-a4in.onrender.com/api/v1/user/update-sup", { ID: id, supId: supervisor });
      if (!res.data.flag) {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update supervisor. Please try again.");
    }
  };

  const handleSubmit = async (e, year, date) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://project-management-system-a4in.onrender.com/api/v1/user/update-date", { year, Date: date });
      if (!res.data.flag) {
        alert("Deadline set successfully");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to set deadline. Please try again.");
    }
  };

  const renderYearSection = (year, date, setDate) => (
    <div className="year-section">
      <h2>{year === 3 ? "3rd" : "4th"} Year Students</h2>
      <div className="deadline-section">
        {date ? (
          <p className="deadline-info">Deadline: {new Date(date).toLocaleDateString()}</p>
        ) : (
          <p className="deadline-info">Deadline: Not set</p>
        )}
      </div>
      <form onSubmit={(e) => handleSubmit(e, year, date)} className="deadline-form">
        <input
          type="date"
          value={date || ""}
          onChange={(e) => setDate(e.target.value)}
          className="date-input"
        />
        <button type="submit" className="submit-button">Set Deadline</button>
      </form>
      <table className="student-table">
        <thead>
          <tr>
            <th>Student's Name</th>
            <th>Roll</th>
            <th>Supervisor Name</th>
          </tr>
        </thead>
        <tbody>
          {students.filter(item => item.year === year).map((item) => (
            <tr key={item._id}>
              <td>{`${item.firstName} ${item.lastName}`}</td>
              <td>{item.rollNumber}</td>
              <td>
                {item.supervisor ? (
                  item.supervisor
                ) : (
                  <form onSubmit={(e) => handleChange(e, item._id)} className="supervisor-form">
                    <select
                      value={supervisor}
                      onChange={(e) => setSupervisor(e.target.value)}
                      className="supervisor-select"
                    >
                      <option value="">Select Supervisor</option>
                      {profList.map((prof) => (
                        <option key={prof._id} value={prof._id}>
                          {`${prof.firstName} ${prof.lastName}`}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="assign-button">Assign</button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="coordinator-container">
      <h1>Coordinator Dashboard</h1>
      {data.coordinatingSem === 3 && renderYearSection(3, date3, setDate3)}
      {data.coordinatingSem === 4 && renderYearSection(4, date4, setDate4)}
    </div>
  );
}

