import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../api";

export default function StudentLogin() {
  const location = useLocation();
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [msg,setMsg]=useState(location.state?.registered ? "Account created. Please login." : "");
  const navigate=useNavigate();

  const submit=async e=>{
    e.preventDefault(); setMsg("");
    try {
      const r=await API.post("/auth/student/login",{email,password});
      localStorage.setItem("token",r.data.token); localStorage.setItem("role","student");
      localStorage.setItem("name",r.data.user.name); localStorage.setItem("id",r.data.user.id);
      navigate("/student/dashboard");
    } catch(e){setMsg(e.response?.data?.msg||"Login failed");}
  };

  return <Auth title="Student Login" subtitle="Access your complaint dashboard.">
    {msg && <div className={`alert ${msg.includes("created")?"success":"error"}`}>{msg}</div>}
    <form onSubmit={submit}><Field label="Email"><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></Field>
    <Field label="Password"><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></Field>
    <button className="primary-btn full">Login</button></form>
    <p className="auth-foot">New student? <Link to="/student/register">Create account</Link></p>
  </Auth>;
}
function Field({label,children}){return <label className="field"><span>{label}</span>{children}</label>;}
function Auth({title,subtitle,children}){return <main className="auth-page"><Link className="back" to="/">← Back to home</Link><section className="auth-card"><div className="auth-logo">CP</div><h1>{title}</h1><p>{subtitle}</p>{children}</section></main>;}