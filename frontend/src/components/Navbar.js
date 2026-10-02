import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ title }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return <header className="navbar">
    <Link to={role === "admin" ? "/admin/dashboard" : "/student/dashboard"} className="brand">
      <span className="brand-mark">CP</span>
      <span>{title}</span>
    </Link>
    <nav>
      {role === "student" && <>
        <Link to="/student/dashboard">Dashboard</Link>
        <Link to="/student/new">New Complaint</Link>
        <Link to="/student/complaints">My Complaints</Link>
      </>}
      <span className="welcome">Hi, {name}</span>
      <button className="logout" onClick={logout}>Logout</button>
    </nav>
  </header>;
}