import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api";

export default function NewComplaint(){
 const [form,setForm]=useState({category:"",title:"",description:""}); const [image,setImage]=useState(null); const [msg,setMsg]=useState(""); const [loading,setLoading]=useState(false); const navigate=useNavigate();
 const submit=async e=>{e.preventDefault();setLoading(true);setMsg("");const d=new FormData();Object.entries(form).forEach(([k,v])=>d.append(k,v));if(image)d.append("image",image);
 try{await API.post("/complaints",d);navigate("/student/complaints")}catch(e){setMsg(e.response?.data?.msg||"Could not submit complaint")}finally{setLoading(false)}};
 return <><Navbar title="New Complaint"/><main className="app-content narrow"><div className="page-head"><div><div className="eyebrow">NEW REQUEST</div><h1>Submit a complaint</h1><p>Give enough detail so the college team can understand the issue.</p></div></div>
 {msg&&<div className="alert error">{msg}</div>}<form className="panel form-panel" onSubmit={submit}>
 <label className="field"><span>Category</span><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} required><option value="">Select category</option><option>Hostel</option><option>Canteen</option><option>Library</option><option>Lab</option><option>Cleanliness</option><option>Faculty</option><option>Infrastructure</option><option>Other</option></select></label>
 <label className="field"><span>Complaint title</span><input maxLength="100" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Short description of the issue" required /></label>
 <label className="field"><span>Description</span><textarea rows="7" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Explain what happened, where, and when..." required /></label>
 <label className="field"><span>Photo evidence <small>(optional, max 5 MB)</small></span><input type="file" accept="image/*" onChange={e=>setImage(e.target.files?.[0]||null)} /></label>
 <div className="form-actions"><button type="button" className="secondary-btn" onClick={()=>navigate(-1)}>Cancel</button><button className="primary-btn" disabled={loading}>{loading?"Submitting...":"Submit Complaint"}</button></div>
 </form></main></>;
}