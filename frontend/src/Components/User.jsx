import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import axios from "axios";
import Projectcard from "./Projectcard";
import { useNavigate } from "react-router-dom";
import Search from "./Search";
import Notification from "./Notification";
import Mypost from "./Mypost";

export default function User() {
  const userId = Cookies.get("UserId");
  const navigate = useNavigate();
  const [userdata, setUserData] = useState({});
  const [toggle, setToggle] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [file, setFile] = useState(null);
  const [domain, setDomain] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [flag, setFlag] = useState(false);
  const [toggleDash, setToggleDash] = useState(false);
  const [tab, setTab] = useState(0);

  // UseEffect to fetch user data
  useEffect(() => {
    const url = "http://localhost:3001/api/v1/user/user-details";
    axios
      .post(url, { id: userId })
      .then((res) => {
        setUserData(res.data.userDetails);  // State update happens here
        console.log("User details fetched:", res.data.userDetails);  // Use the response directly here
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userId]);

  // Log userdata when it is updated
  useEffect(() => {
    console.log("Updated userdata:", userdata);  // This will trigger once userdata is updated
  }, [userdata]);

  async function handleSubmit(e) {
    e.preventDefault();
    const projectData = new FormData();
    projectData.append("Name", projectName);
    projectData.append("desc", projectDescription);
    projectData.append("projectFile", file);
    projectData.append("domain", domain);
    projectData.append("projectImage", selectedImage);
    projectData.append("id", userId);
    projectData.append("status", "Submitted");
    const url = "http://localhost:3001/api/v1/post/post-entry";
    await axios
      .post(url, projectData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (!res.data.flag) {
          alert("Project Submitted");
          setToggle(!toggle);
          window.location.reload();
        } else {
          setFlag(res.data.flag);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    //sendNotification();
  }

  const handleFileChange = (e) => {
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    setFile(files[0]);
  };

  const selectFile = (e) => {
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    setSelectedImage(files[0]);
  };

  function handleLogout() {
    Cookies.remove("auth");
    Cookies.remove("UserId");
    navigate("/");
    window.location.reload();
  }

  return (
    <div className="home">
      <header className="head-container">
        <h1>Project Management System</h1>
        <div className="header-right">
          {userdata && userdata.photo && (  // Ensure userdata is available before rendering
            <>
              <div
                className="avatar"
                onClick={() => {
                  setToggleDash(!toggleDash);
                  setTab(0);
                }}
              >
                <img
                  className="avatar-image"
                  src={`data:${
                    userdata.photo.contentType
                  };base64,${btoa(
                    String.fromCharCode(
                      ...new Uint8Array(userdata.photo.data.data)
                    )
                  )}`}
                  alt="..."
                />
                <p
                  style={{
                    textShadow: "0.5vh 0.5vh 1vh black",
                    color: "white",
                  }}
                >
                  {userdata.first} {userdata.last}
                </p>
              </div>
            </>
          )}
        </div>
      </header>

      <div
        style={{
          float: "right",
          margin: "2vh",
          width: "40vh",
          height: "40vh",
          display: "flex",
          flexDirection: "column",
          gap: "1vh",
        }}
      >
        <p
          id={tab === 1 ? "active" : "logout"}
          onClick={() => {
            setTab(1);
          }}
        >
          Search
        </p>
        <p
          id={tab === 2 ? "active" : "logout"}
          onClick={() => {
            setTab(2);
          }}
        >
          My Projects
        </p>
        <p
          id={tab === 3 ? "active" : "logout"}
          onClick={() => {
            setTab(3);
          }}
        >
          Notification
        </p>
        <p id="logout" onClick={handleLogout}>
          Log Out
        </p>
      </div>

      <div className="post-form">
        {new Date(userdata?.submissionDate) > new Date() && (
          <>
            <button id="logout" onClick={() => setToggle(!toggle)}>
              Create
            </button>
            <br />
            <h3
              style={{
                color: "green",
              }}
            >
              Deadline:
              {new Date(userdata.submissionDate).toLocaleDateString()}
            </h3>
            <h3 style={{ color: "red" }}>
              please submit before deadline or portal will be closed
            </h3>
          </>
        )}
        {toggle && (
          <>
            <div className="signup-container">
              <form className="signup-form" onSubmit={handleSubmit}>
                {flag && <p style={{ color: "red" }}>Change your Project name</p>}
                <label for="name">Project Name :</label>
                <input
                  required="required"
                  type="text"
                  placeholder="Project Name"
                  value={projectName}
                  maxLength={30}
                  onChange={(e) => setProjectName(e.target.value)}
                />
                <label>Image Relevant to your project:</label>
                <input
                  required="required"
                  type="file"
                  accept="image/*"
                  onChange={(e) => selectFile(e)}
                />

                <label for="desc">Project Description :</label>
                <textarea
                  maxLength={200}
                  cols="30"
                  rows="10"
                  placeholder="Project Description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
                <label>Upload .docx or .pdf file:</label>
                <input
                  required="required"
                  type="file"
                  accept=".docx, application/pdf"
                  onChange={(e) => handleFileChange(e)}
                />
                <label for="branch">Project Domain: </label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  required="required"
                >
                  <option value="">Select Domain</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Web Development">Web Development</option>
                  <option value="App Development">App Development</option>
                  <option value="Networking">Networking</option>
                  <option value="Cyber Security">Cyber Security</option>
                </select>
                <input required="required" type="submit" value="Submit" />
              </form>
            </div>
          </>
        )}
      </div>
      <div className="post-container">
        {tab === 0 ? userdata && <Projectcard /> : null}
        {tab === 1 ? userdata && <Search /> : null}
        {tab === 2 ? userdata && <Mypost Id={userId} /> : null}
        {tab === 3 ? userdata && <Notification /> : null}
      </div>
      <footer className="foot-container">
        <h1></h1>
      </footer>
    </div>
  );
}
