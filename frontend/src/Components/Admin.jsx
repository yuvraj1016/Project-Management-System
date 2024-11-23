import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Admin.css";

export default function Admin() {
  const [profList, setProflist] = useState([]);
  const [year, setYear] = useState(3);
  const [yearId, setYearId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const url = "https://project-management-system-a4in.onrender.com/api/v1/professor/get-all";
        const res = await axios.get(url);
        setProflist(res.data.prof);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch professors. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfessors();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const url = "https://project-management-system-a4in.onrender.com/api/v1/professor/update-coordinator";
      await axios.post(url, { id: yearId, Year: year });
      alert(`Coordinator for ${year}rd/th year has been selected. Please set for the other year.`);
    } catch (err) {
      console.error(err);
      alert("Failed to update coordinator. Please try again.");
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-container">
      <h1>Select Coordinator</h1>
      <div className="year-selection">
        <label className="radio-label">
          <input
            type="radio"
            value={3}
            checked={year === 3}
            onChange={() => setYear(3)}
          />
          <span>Third Year</span>
        </label>
        <label className="radio-label">
          <input
            type="radio"
            value={4}
            checked={year === 4}
            onChange={() => setYear(4)}
          />
          <span>Fourth Year</span>
        </label>
      </div>
      <form className="coordinator-form" onSubmit={handleSubmit}>
        <select 
          value={yearId} 
          required 
          onChange={(e) => setYearId(e.target.value)}
          className="professor-select"
        >
          <option value="">Select a professor</option>
          {profList.map((item) => (
            <option key={item._id} value={item._id}>
              {item.firstName} {item.lastName}
            </option>
          ))}
        </select>
        <button type="submit" className="submit-button">Set as Coordinator</button>
      </form>
    </div>
  );
}

