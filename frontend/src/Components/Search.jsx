import { useState } from "react";
import axios from "axios";

export default function Search() {
    const [project, setProject] = useState([]);
    const [type, setType] = useState('');
    const [roll, setRoll] = useState(null);
    const [name, setName] = useState('');
    const [semester, setSemester] = useState(null);
    const [year, setYear] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (roll) {
            let body = {
                rollno: roll
            }
            const url = "http://localhost:3001/api/v1/post/search-roll";
            axios.post(url, body)
                .then((res) => {
                    setProject(res.data.project);
                    console.log(project);
                }).catch((err) => {
                    console.log(err);
                })
        }
        if (name) {
            let body = {
                supname: name
            }
            const url = "http://localhost:3001/api/v1/post/search-supervisor";
            axios.post(url, body)
                .then((res) => {
                    setProject(res.data.project);
                    console.log(project);
                }).catch((err) => {
                    console.log(err);
                })
        }
        if (semester) {
            let body = {
                sem: semester
            }
            const url = "http://localhost:3001/api/v1/post/search-semester";
            axios.post(url, body)
                .then((res) => {
                    setProject(res.data.project);
                    console.log(project);
                }).catch((err) => {
                    console.log(err);
                })
        }
        if (year) {
            let body = {
                Year: year
            }
            const url = "http://localhost:3001/api/v1/post/search-year";
            axios.post(url, body)
                .then((res) => {
                    setProject(res.data.project);
                    console.log(project);
                }).catch((err) => {
                    console.log(err);
                })
        }
    }
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
    return (
        <div className="searchContainer">
            <form className="searchBar" onSubmit={(e) => handleSubmit(e)}>
                <select value={type} onChange={(e) => { setType(e.target.value) }} required="required">
                    <option value="">Choose the type of search</option>
                    <option value="Roll">Search By Roll</option>
                    <option value="Supervisor">Search By SuperVisor Name</option>
                    <option value="Semester">Search By Semester</option>
                    <option value="Year">Search by Year</option>
                </select>
                {type ? (type === "Roll") && <input type="tel" pattern="[0-9]{8}" placeholder="Roll Number" value={roll} minLength={8} maxLength={8} onChange={(e) => setRoll(e.target.value)} required="required" /> : null}
                {type ? (type === "Supervisor") && <input type="text" placeholder="Supervisor name" value={name} maxLength={25} onChange={(e) => setName(e.target.value)} required="required" /> : null}
                {type ? (type === "Semester") && <input type="tel" pattern="[1-8]{1}" placeholder="Semester" value={semester} minLength={1} maxLength={1} onChange={(e) => setSemester(e.target.value)} required="required" /> : null}
                {type ? (type === "Year") && <input type="tel" pattern="[1-4]{1}" placeholder="Year" value={year} minLength={1} maxLength={1} onChange={(e) => setYear(e.target.value)} required="required" /> : null}
                <input type="Submit" value="Search" />
            </form>
            <div className="projectCard">
                {
                    project.length > 0 && (
                        project.map((item) => {
                            return (
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
        </div>
    )
}