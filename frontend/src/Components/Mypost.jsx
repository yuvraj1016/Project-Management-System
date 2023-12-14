import axios from "axios";
import { useState, useEffect } from "react";


export default function Mypost({ Id }) {
    const [project, setProject] = useState([]);
    useEffect(() => {
        const url = "http://localhost:3001/api/v1/post/user-post";
        axios.post(url, { id: Id })
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
        }
        const url = `http://localhost:3001/api/v1/post/update-views`;
        await axios.get(url, { params })
            .then((res) => {
                window.location.reload();
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
                            <>
                                <div className="projectContainer" key={item._id} onClick={() => updateView(item._id, item.viewed)}>
                                    <div className="head">
                                        <div className="card">
                                            <h1>
                                                {item.projectName}
                                            </h1>
                                            <img
                                                className="project-image"
                                                src={`data:${item.projectImage.contentType};base64,${btoa(String.fromCharCode(...new Uint8Array(item.projectImage.data.data)))}`}
                                            />
                                        </div>
                                        <div>
                                            <h3>Description</h3>
                                            <p>{item.projectDescription}</p>
                                            <p style={{ fontWeight: "bold" }}>Views : {item.viewed}</p>
                                            {item.grade && <p style={{ fontWeight: "bold" }}>Grade: {item.grade}</p>}
                                            <p style={{ fontWeight: "bold" }}>Submitted To : {item.supervisorName}</p>
                                            <p style={{ fontWeight: "bold" }}>Supervisor Email : <a href="mailto:example@example.com">{item.supervisorEmail}</a></p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    })
                )
            }
            <button id="logout">Load More</button>
        </div>
    )
}