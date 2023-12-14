import { useState, useEffect } from "react";
import axios from "axios";
export default function Supervisor({ data }) {
  const [student, setStudent] = useState([]);
  const [project, setProject] = useState([]);
  useEffect(() => {
    const url = "http://localhost:3001/api/v1/post/getprof-post";
    const body = {
      email: data.email,
    };
    console.log(data.email);
    axios
      .post(url, body)
      .then((res) => {
        setProject(res.data.project);
        console.log(project);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    const url = "http://localhost:3001/api/v1/user/get";
    axios
      .post(url, { sup: data.email })
      .then((res) => {
        setStudent(res.data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="projectCard">
      <h1>3rd Years</h1>
      <table>
        <th>Student's Name</th>
        <th>Roll</th>
        <th>Project Name</th>
        <th>Project Status</th>
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
                    <>
                      {project.map((item2) => {
                        return (
                          <>
                            {item._id === item2.user && (
                              <>
                                <td>{item2.projectName}</td>
                                <td>
                                  {item2.status ? item2.status : "Pending"}
                                </td>
                              </>
                            )}
                            {item._id !== item2.user && (
                              <>
                                <td>Not found</td>
                                <td> Pending </td>
                              </>
                            )}
                          </>
                        );
                      })}
                    </>
                  </tr>
                )}
              </>
            );
          })}
      </table>
      <h1>4th Years</h1>
      <table>
        <th>Student's Name</th>
        <th>Roll</th>
        <th>Project Name</th>
        <th>Project Status</th>
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
                    <>
                      {project.map((item2) => {
                        return (
                          <>
                            {item._id === item2.user && (
                              <>
                                <td>{item2.projectName}</td>
                                <td>
                                  {item2.status ? item2.status : "Pending"}
                                </td>
                              </>
                            )}
                            {item._id !== item2.user && (
                              <>
                                <td>Not found</td>
                                <td> Pending </td>
                              </>
                            )}
                          </>
                        );
                      })}
                    </>
                  </tr>
                )}
              </>
            );
          })}
      </table>
    </div>
  );
}
