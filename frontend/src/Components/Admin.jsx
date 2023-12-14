import { useState, useEffect } from "react";
import axios from "axios";
export default function Admin() {
  const [profList, setProflist] = useState([]);
  const [year, setYear] = useState(3);
  const [yearId,setYearId] = useState('');
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
  async function handleSubmit(e){
    e.preventDefault();
    console.log({id:yearId,Year:year})
    const url = "http://localhost:3001/api/v1/professor/update-coordinator";
    axios.post(url,{id:yearId,Year:year})
    .then((res)=>{
        alert(`co-ordinator for ${year} has been selected now set for the other year`);
    })
    .catch(err=>console.log(err));
  }
  return (
    <div className="projectCard">
      <h1>Select Co-ordinator </h1>
      <div>
        <label>
          <input
            type="radio"
            value={year}
            checked={year === 3}
            onChange={() => setYear(3)}
          />
          Third Year
        </label>
        <label>
          <input
            type="radio"
            value={year}
            checked={year === 4}
            onChange={() => setYear(4)}
          />
          Fourth Year
        </label>
      </div>
      {year === 3 && (
        <form className="projectContainer" onSubmit={(e)=>handleSubmit(e)}>
          <select value={yearId} required="required" onChange={(e)=>{setYearId(e.target.value)}}>
            {profList.length > 0 &&
              profList.map((item) => {
                return (
                  <option value={item._id}>
                    {item.firstName} {item.lastName}
                  </option>
                );
              })}
          </select>
          <input type="submit" value="Submit" />
        </form>
      )}
      {year === 4 && (
        <form className="projectContainer" onSubmit={(e)=>handleSubmit(e)}>
          <select value={yearId} required="required" onChange={(e)=>{setYearId(e.target.value)}}>
            {profList.length > 0 &&
              profList.map((item) => {
                return (
                  <option value={item._id}>
                    {item.firstName} {item.lastName}
                  </option>
                );
              })}
          </select>
          <input type="submit" value="Submit" />
        </form>
      )}
    </div>
  );
}
