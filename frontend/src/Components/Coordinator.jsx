import { useState, useEffect } from "react";
import axios from "axios";
export default function Coordinator({ data }) {
  const [student, setStudent] = useState([]);
  const [profList, setProflist] = useState([]);
  const [date1, setDate1] = useState(null);
  const [date2, setDate2] = useState(null);
  const [supervisor, setSuperVisor] = useState("");
  useEffect(() => {
    const url = "http://localhost:3001/api/v1/user/getall";
    axios
      .get(url)
      .then((res) => {
        setStudent(res.data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    const url = "http://localhost:3001/api/v1/professor/get-all";
    axios
      .get(url)
      .then((res) => {
        setProflist(res.data.prof);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  async function handleChange(e, id) {
    e.preventDefault();
    const url = "http://localhost:3001/api/v1/user/update-sup";
    await axios
      .post(url, { ID: id, supId: supervisor })
      .then((res) => {
        if (!res.data.flag) {
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async function handleSubmit(e, Year, date) {
    e.preventDefault();
    const url = "http://localhost:3001/api/v1/user/update-date";
    await axios
      .post(url, { year: Year, Date: date })
      .then((res) => {
        if (!res.data.flag) {
          alert("deadline set");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div className="projectCard">
      {data.coordinatingSem === 3 &&
        (
          <>
            <h1>3rd Years</h1>
            {date1 ? <p>{`Deadline ${new Date(date1).toLocaleDateString()}`}</p> : <p>Deadline Loading...</p>}
            <form onSubmit={(e) => { handleSubmit(e, 3, date1) }}>
              <label for="deadline">Set Project Deadline : </label>
              <input type="date" value={date1} onChange={(e) => { setDate1(e.target.value) }} />
              <input type="submit" value="Submit" />
            </form>
            <table>
              <th>Student's Name</th>
              <th>Roll</th>
              <th>Supervisor Name</th>
              {student.length > 0 &&
                student.map((item) => {
                  return (
                    <>
                      {item.year === 3 && (
                        <tr style={{ textAlign: "center" }}>
                          <td>
                            {item.firstName} {item.lastName}
                          </td>
                          <td>{item.rollNumber}</td>
                          <td>
                            {item.supervisor ? (
                              item.supervisor
                            ) : (
                              <form
                                onSubmit={(e) => {
                                  handleChange(e, item._id);
                                }}
                              >
                                <select
                                  value={supervisor}
                                  required="required"
                                  onChange={(e) => {
                                    setSuperVisor(e.target.value);
                                  }}
                                >
                                  {profList.length > 0 &&
                                    profList.map((item2) => {
                                      return (
                                        <option value={item2._id}>
                                          {item2.firstName} {item2.lastName}
                                        </option>
                                      );
                                    })}
                                </select>
                                <input type="submit" value="Submit" />
                              </form>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
            </table>
          </>
        )}
      { data.coordinatingSem===4&&(
        <>
          <h1>4th Years</h1>
          {date2 ? <p>{`Deadline ${new Date(date2).toLocaleDateString()}`}</p> : <p>Deadline Loading...</p>}
          <form onSubmit={(e) => { handleSubmit(e, 4, date2) }}>
            <label for="deadline">Set Project Deadline : </label>
            <input type="date" value={date2} onChange={(e) => { setDate2(e.target.value) }} />
            <input type="submit" value="Submit" />
          </form>
          <table>
            <th>Student's Name</th>
            <th>Roll</th>
            <th>Supervisor Name</th>
            {student.length > 0 &&
              student.map((item) => {
                return (
                  <>
                    {item.year === 4 && (
                      <tr style={{ textAlign: "center" }}>
                        <td>
                          {item.firstName} {item.lastName}
                        </td>
                        <td>{item.rollNumber}</td>
                        <td>
                          {item.supervisor ? (
                            item.supervisor
                          ) : (
                            <form
                              onSubmit={(e) => {
                                handleChange(e, item._id);
                              }}
                            >
                              <select
                                value={supervisor}
                                required="required"
                                onChange={(e) => {
                                  setSuperVisor(e.target.value);
                                }}
                              >
                                {profList.length > 0 &&
                                  profList.map((item2) => {
                                    return (
                                      <option value={item2._id}>
                                        {item2.firstName} {item2.lastName}
                                      </option>
                                    );
                                  })}
                              </select>
                              <input type="submit" value="Submit" />
                            </form>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
          </table>
        </>
      )}
    </div>
  );
}
