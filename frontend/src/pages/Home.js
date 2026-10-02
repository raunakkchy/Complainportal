import { Link } from "react-router-dom";

export default function Home() {
  return <main className="landing">
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow">DIGITAL STUDENT SERVICES</div>
        <h1>College Complaint<br /><span>Portal</span></h1>
        <p>Raise campus issues, follow their progress, and communicate with college administration from one simple portal.</p>
        <div className="hero-actions">
          <Link className="primary-btn" to="/student/login">Student Login</Link>
          <Link className="secondary-btn" to="/student/register">Create Account</Link>
        </div>
      </div>
      <div className="hero-card">
        <div className="mini-label">HOW IT WORKS</div>
        <div className="flow"><b>01</b><div><strong>Submit</strong><small>Describe your issue</small></div></div>
        <div className="line"></div>
        <div className="flow"><b>02</b><div><strong>Track</strong><small>See live complaint status</small></div></div>
        <div className="line"></div>
        <div className="flow"><b>03</b><div><strong>Resolve</strong><small>Receive admin replies</small></div></div>
      </div>
    </section>
    <section className="feature-strip">
      <div><strong>Simple</strong><span>Student-friendly complaint submission</span></div>
      <div><strong>Transparent</strong><span>Track every complaint status</span></div>
      <div><strong>Connected</strong><span>Direct admin communication</span></div>
      <Link className="admin-link" to="/admin/login">Admin Portal →</Link>
    </section>
  </main>;
}