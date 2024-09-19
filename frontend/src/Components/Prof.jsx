import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import axios from "axios";
import Profprojectcard from "./Profprojectcard";
import { useNavigate } from "react-router-dom";
import Projectcard from "./Projectcard";
import Gradecard from "./Gradecard";
import Search from "./Search";
import Profnoti from "./Profnoti";
import Admin from "./Admin";
import Coordinator from "./Coordinator";
import Supervisor from "./Supervisor";

export default function Prof() {
    const userId = Cookies.get("UserId");
    const navigate = useNavigate();
    const [userdata, setUserData] = useState({});
    const [toggle, setToggle] = useState(false);
    const [tab, setTab] = useState(0);

    useEffect(() => {
        const url = "http://localhost:3001/api/v1/professor/prof-details";
        axios.post(url, { id: userId })
            .then((res) => {
                setUserData(res.data);
                console.log(userdata);
            }).catch((err) => {
                console.log(err);
            });
    }, [userId]);


    function handleLogout() {
        Cookies.remove("profauth");
        Cookies.remove("UserId");
        navigate('/');
        window.location.reload();
    }
    return (
        <div className="home">
            <header className="head-container">
                <h1>Project Management System</h1>
                <div className="header-right">
                    {
                        (userdata.userDetails) &&
                        (
                            <>
                                <div
                                    className="avatar"
                                    onClick={() => {
                                        setToggle(!toggle);
                                        setTab(0);
                                    }}
                                >
                                    <img
                                        className="avatar-image"
                                        src={`data:${userdata.userDetails.photo.contentType};base64,${btoa(String.fromCharCode(...new Uint8Array(userdata.userDetails.photo.data.data)))}`}
                                        alt="..."
                                    />
                                    <p style={{ textShadow: "0.5vh 0.5vh 1vh black", color: "white" }}>{userdata.userDetails.first} {userdata.userDetails.last}</p>
                                </div>
                            </>
                        )

                    }
                </div>
            </header>


            <div style={{ float: "right", margin: "2vh", width: "40vh", height: "40vh", display: "flex", flexDirection: "column", gap: "1vh" }}>
                <p
                    id={tab === 1 ? "active" : "logout"}
                    onClick={() => {
                        setTab(1);
                    }}
                >
                    Search
                </p>
                {userdata?.userDetails?.isAdmin && (<p
                    id={tab === 5 ? "active" : "logout"}
                    onClick={() => {
                        setTab(5);
                    }}
                >
                    Admin Panel
                </p>)}
                {userdata?.userDetails?.isCoordinator && (<p
                    id={tab === 6 ? "active" : "logout"}
                    onClick={() => {
                        setTab(6);
                    }}
                >
                    Co-ordinator Panel
                </p>)}
                <p
                    id={tab === 2 ? "active" : "logout"}
                    onClick={() => {
                        setTab(2);
                    }}
                >
                    Supervisor Panel
                </p>
                <p
                    id={tab === 7 ? "active" : "logout"}
                    onClick={() => {
                        setTab(7);
                    }}
                >
                    Submitted projects
                </p>
                <p
                    id={tab === 3 ? "active" : "logout"}
                    onClick={() => {
                        setTab(3);
                    }}
                >
                    Graded Project
                </p>
                <p
                    id={tab === 4 ? "active" : "logout"}
                    onClick={() => {
                        setTab(4);
                    }}
                >
                    Notification
                </p>
                <p
                    id="logout"
                    onClick={handleLogout}
                >
                    Log Out
                </p>
            </div>

            <div className="post-container">

                {tab === 0 ? userdata.userDetails && <Projectcard /> : null}
                {tab === 1 && <Search />}
                {tab === 2 ? userdata.userDetails && <Supervisor data={userdata.userDetails} /> : null}
                {tab === 3 ? userdata.userDetails && <Gradecard data={userdata.userDetails} /> : null}
                {tab === 4 ? userdata.userDetails && <Profnoti /> : null}
                {tab === 5 ? userdata.userDetails.isAdmin && <Admin /> : null}
                {tab === 6 ? userdata.userDetails.isCoordinator && <Coordinator data={userdata.userDetails}/> : null}
                {tab === 7 ? userdata.userDetails && <Profprojectcard data={userdata.userDetails} /> : null}

            </div>
            <footer className="foot-container">
                <h1></h1>
            </footer>
        </div>
    )
}
