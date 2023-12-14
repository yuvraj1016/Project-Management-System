import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";


export default function Profprojectcard({ data }) {
  const userId = Cookies.get("UserId");
  const [project, setProject] = useState([]);
  const [grade, setGrade] = useState('');
  useEffect(() => {
    const url = "http://localhost:3001/api/v1/post/getprof-post";
    const body = {
      email: data.email,
    };
    axios.post(url, body)
      .then((res) => {
        setProject(res.data.project);
        console.log(project);
      }).catch((err) => {
        console.log(err);
      })
  }, [])
  async function updateView(id, view) {
    const params = {
      userid: id,
      viewed: view + 1,
    };
    const url = `http://localhost:3001/api/v1/post/update-views`;
    await axios.get(url, { params })
      .then((res) => {
        window.location.reload();
      }).catch((err) => {
        console.log(err);
      })
  }
  async function updateGrade(e, id) {
    e.preventDefault();
    const params = {
      userid: id,
      Grade: grade,
    };
    const url = `http://localhost:3001/api/v1/post/update-grade`;
    await axios.get(url, { params })
      .then((res) => {
        window.location.reload();
      }).catch((err) => {
        console.log(err);
      })
  }
  async function sendNotification(id, first, last, roll) {
    const body = {
      To: id,
      From: userId,
      Body: `${first} ${last} Roll ${roll} your project have been graded by Dr. ${data.first} ${data.last}`
    }
    console.log(body);
    const url = `http://localhost:3001/api/v1/notification/add-notification`;
    await axios.post(url, body)
      .then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err);
      })
  }
  return (
    <div className="projectCard">
      {
        project.length > 0 && (
          project.map((item) => {
            return (
              !item.grade &&
              <>
                <div className="projectContainer" key={item._id} >
                  <div className="head">
                    <div className="card">
                      <h1 onClick={() => updateView(item._id, item.viewed)}>
                        {item.projectName}
                      </h1>
                      <img
                        className="project-image"
                        src={`data:${item.projectImage.contentType};base64,${btoa(String.fromCharCode(...new Uint8Array(item.projectImage.data.data)))}`}
                      />
                    </div>
                    <div>
                      <form key={item._id}
                        onSubmit={(e) => {
                          updateGrade(e, item._id);
                          sendNotification(item.user, item.firstName, item.lastName, item.rollNumber);
                        }}>
                        <label for="grade">Grade The Project : </label>
                        <select value={grade} onChange={(e) => setGrade(e.target.value)}>
                          <option value="">Select Grade</option>
                          <option value="AA">AA</option>
                          <option value="AB">AB</option>
                          <option value="BB">BB</option>
                          <option value="BC">BC</option>
                          <option value="CC">CC</option>
                          <option value="CD">CD</option>
                          <option value="DD">DD</option>
                          <option value="FF">FF</option>
                          <option value="I">I</option>
                        </select>
                        <input type="submit" value="Add Grade" style={{ backgroundColor: "yellowgreen" }} />
                      </form>
                      <p>
                        Submitted by : {item.firstName} {item.lastName}
                        <br />
                        Roll : {item.rollNumber}
                        <br />
                        Year : {item.year}th
                        <br />
                        Semester : {item.semester}th
                      </p>
                    </div>
                  </div>
                  <div className="project-desc">
                    <h3>Description</h3>
                    <p>{item.projectDescription}</p>
                    <p style={{ fontWeight: "bold" }}>Views : {item.viewed}</p>
                    {item.grade && <p style={{ fontWeight: "bold" }}>Grade: {item.grade}</p>}
                    <p style={{ fontWeight: "bold" }}>Submitted To : {item.supervisorName}</p>
                    <p style={{ fontWeight: "bold" }}>Supervisor Email : <a href="mailto:example@example.com">{item.supervisorEmail}</a></p>
                  </div>
                </div>
              </>
            )
          })
        )
      }
    </div>
  )
}