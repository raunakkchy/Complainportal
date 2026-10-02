import { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api";

export default function StudentDashboard(){
 const [s,setS]=useState({total:0,pending:0,progress:0,resolved:0});
 useEffect(()=>{API.get("/complaints/stats").then(r=>setS(r.data)).catch(()=>{})},[]);
 return <><Navbar title="Complaint Portal"/><main className="app-content">
   <div className="page-head"><div><div className="eyebrow">STUDENT AREA</div><h1>Dashboard</h1><p>Overview of your submitted complaints.</p></div><Link className="primary-btn" to="/student/new">+ New Complaint</Link></div>
   <div className="stats-grid"><Stat label="Total complaints" value={s.total}/><Stat label="Pending" value={s.pending}/><Stat label="In progress" value={s.progress}/><Stat label="Resolved" value={s.resolved}/></div>
   <div className="quick"><div><h2>Need to report an issue?</h2><p>Submit a complaint with category, description and an optional image.</p></div><Link className="secondary-btn" to="/student/new">Submit complaint →</Link></div>
 </main></>;
}
function Stat({label,value}){return <div className="stat"><span>{label}</span><strong>{value}</strong></div>}