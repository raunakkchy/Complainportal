import { useEffect,useState } from "react";
import { useParams,Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api";

export default function TrackComplaint(){
 const {id}=useParams();const [data,setData]=useState(null);const [error,setError]=useState("");
 useEffect(()=>{API.get(`/complaints/${id}`).then(r=>setData(r.data)).catch(e=>setError(e.response?.data?.msg||"Could not load complaint"))},[id]);
 return <><Navbar title="Complaint Details"/><main className="app-content narrow">{error?<div className="alert error">{error}</div>:!data?<p>Loading...</p>:<><Link className="back-inline" to="/student/complaints">← Back to complaints</Link><div className="panel detail"><div className="detail-top"><div><div className="eyebrow">COMPLAINT #{data.complaint._id.slice(-6).toUpperCase()}</div><h1>{data.complaint.title}</h1></div><span className={`status ${data.complaint.status==="Resolved"?"resolved":data.complaint.status==="In-Progress"?"progress":"pending"}`}>{data.complaint.status}</span></div><div className="detail-meta"><span>{data.complaint.category}</span><span>{new Date(data.complaint.createdAt).toLocaleString()}</span></div><p className="description">{data.complaint.description}</p>{data.complaint.image&&<img className="attachment" src={`${(process.env.REACT_APP_API_URL||"http://localhost:5000/api").replace("/api","")}/uploads/${data.complaint.image}`} alt="Complaint evidence"/>}</div>
 <h2 className="section-title">Admin replies</h2>{data.replies.length===0?<div className="panel empty"><strong>No reply yet</strong><span>The administration has not replied to this complaint.</span></div>:data.replies.map(r=><div className="panel reply" key={r._id}><div><strong>{r.admin?.name||"Admin"}</strong><span>{new Date(r.createdAt).toLocaleString()}</span></div><p>{r.message}</p></div>)}</>}</main></>;
}