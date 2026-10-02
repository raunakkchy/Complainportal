import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

export default function AdminLogin(){
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [msg,setMsg]=useState(""); const navigate=useNavigate();
  const submit=async e=>{e.preventDefault();try{const r=await API.post("/auth/admin/login",{email,password});localStorage.setItem("token",r.data.token);localStorage.setItem("role","admin");localStorage.setItem("name",r.data.user.name);localStorage.setItem("id",r.data.user.id);navigate("/admin/dashboard")}catch(e){setMsg(e.response?.data?.msg||"Login failed")}};
  return <main className="auth-page"><Link className="back" to="/">← Back to home</Link><section className="auth-card">
    <div className="auth-logo dark">AD</div><h1>Admin Portal</h1><p>Manage student complaints and responses.</p>
    {msg&&<div className="alert error">{msg}</div>}
    <form onSubmit={submit}><label className="field"><span>Email</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
    <label className="field"><span>Password</span><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
    <button className="primary-btn full dark-btn">Admin Login</button></form>
    <div className="demo-box"><strong>Demo admin</strong><br/>admin@college.com<br/>admin123</div>
  </section></main>;
}