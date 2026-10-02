import { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api";

export default function MyComplaints(){
 const [items,setItems]=useState([]); const [loading,setLoading]=useState(true);
 useEffect(()=>{API.get("/complaints/my").then(r=>setItems(r.data)).catch(()=>{}).finally(()=>setLoading(false))},[]);
 return <><Navbar title="My Complaints"/><main className="app-content"><div className="page-head"><div><div className="eyebrow">HISTORY</div><h1>My complaints</h1><p>View status and replies for your submitted issues.</p></div><Link className="primary-btn" to="/student/new">+ New Complaint</Link></div>
 <div className="panel table-wrap">{loading?<p>Loading...</p>:items.length===0?<div className="empty"><strong>No complaints yet</strong><span>Your submitted complaints will appear here.</span><Link to="/student/new">Submit your first complaint</Link></div>:
 <table><thead><tr><th>Complaint</th><th>Category</th><th>Status</th><th>Date</th><th></th></tr></thead><tbody>{items.map(c=><tr key={c._id}><td><strong>#{c._id.slice(-6).toUpperCase()}</strong><br/><span className="muted">{c.title}</span></td><td>{c.category}</td><td><Status s={c.status}/></td><td>{new Date(c.createdAt).toLocaleDateString()}</td><td><Link to={`/student/track/${c._id}`} className="text-btn">View →</Link></td></tr>)}</tbody></table>}</div>
 </main></>;
}
function Status({s}){return <span className={`status ${s==="Resolved"?"resolved":s==="In-Progress"?"progress":"pending"}`}>{s}</span>}