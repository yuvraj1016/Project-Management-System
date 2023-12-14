import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";


export default function Profnoti() {
    const userId = Cookies.get("UserId");
    const [noti, setNoti] = useState([]);
    useEffect(() => {
        const url = `http://localhost:3001/api/v1/notification/prof-notification`;
        axios.post(url, { user: userId })
            .then((res) => {
                setNoti(res.data.notification);
            })
    }, []);
    async function updateNoti(id) {
        const url = `http://localhost:3001/api/v1/notification/update-notification`;
        await axios.post(url, { Id: id })
            .then((res) => {
                window.location.reload();
            }).catch((err) => {
                console.log(err);
            })
    }

    return (
        <div className="noti-container">
            <h4>Unread Notification :</h4>
            {noti.length > 0 && (
                noti.map((item) => {
                    return (
                        <>
                            {
                                !item.read &&
                                <>

                                    <div className="noti-Bar" key={item._id} onClick={() => updateNoti(item._id)}>
                                        {item.body}
                                    </div>
                                </>}
                        </>
                    )
                })
            )}
            <h4>Read Notification :</h4>
            {noti.length > 0 && (
                noti.map((item) => {
                    return (
                        <>
                            {
                                item.read &&
                                <>

                                    <div className="noti-Active" key={item._id} onClick={() => updateNoti(item._id)}>
                                        {item.body}
                                    </div>
                                </>
                            }
                        </>
                    )
                })
            )}
        </div>
    )
}
