import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

export default function StudentRegister() {
  const [form, setForm] = useState({ name:"", email:"", password:"", enrollmentNo:"", department:"" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault(); setMsg(""); setLoading(true);
    try { await API.post("/auth/student/register", form); navigate("/student/login", { state:{ registered:true } }); }
    catch(e) { setMsg(e.response?.data?.msg || "Registration failed"); }
    finally { setLoading(false); }
  };

  return <AuthLayout title="Create student account" subtitle="Register to submit and track complaints.">
    {msg && <div className="alert error">{msg}</div>}
    <form onSubmit={submit}>
      <Field label="Full name"><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></Field>
      <Field label="Email"><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></Field>
      <div className="two"><Field label="Enrollment no."><input value={form.enrollmentNo} onChange={e=>setForm({...form,enrollmentNo:e.target.value})} required /></Field>
      <Field label="Department"><select value={form.department} onChange={e=>setForm({...form,department:e.target.value})} required><option value="">Select</option><option>CSE</option><option>IT</option><option>ECE</option><option>Mechanical</option><option>Civil</option></select></Field></div>
      <Field label="Password"><input type="password" minLength="6" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required /></Field>
      <button className="primary-btn full" disabled={loading}>{loading ? "Creating..." : "Create Account"}</button>
    </form>
    <p className="auth-foot">Already registered? <Link to="/student/login">Login</Link></p>
  </AuthLayout>;
}

function Field({label,children}) { return <label className="field"><span>{label}</span>{children}</label>; }
function AuthLayout({title,subtitle,children}) { return <main className="auth-page"><Link className="back" to="/">← Back to home</Link><section className="auth-card"><div className="auth-logo">CP</div><h1>{title}</h1><p>{subtitle}</p>{children}</section></main>; }