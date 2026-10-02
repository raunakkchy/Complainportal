import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api";

const API_ORIGIN = (process.env.REACT_APP_API_URL || "/api").replace(/\/api\/?$/, "");

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, progress: 0, resolved: 0 });
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("Pending");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const imageUrl = (filename) =>
    filename ? `${API_ORIGIN}/uploads/${encodeURIComponent(filename)}` : "";

  const load = async () => {
    try {
      const [complaints, statsRes] = await Promise.all([
        API.get(`/admin/complaints${filter ? `?status=${encodeURIComponent(filter)}` : ""}`),
        API.get("/admin/stats")
      ]);
      setItems(complaints.data);
      setStats(statsRes.data);
    } catch (e) {
      setMsg(e.response?.data?.msg || "Could not load complaints");
    }
  };

  useEffect(() => {
    load();
  }, [filter]);

  const open = async (id) => {
    setMsg("");
    try {
      const r = await API.get(`/complaints/${id}`);
      setSelected(r.data);
      setStatus(r.data.complaint.status);
      setReply("");
    } catch (e) {
      setMsg(e.response?.data?.msg || "Could not open complaint");
    }
  };

  const updateStatus = async () => {
    if (!selected) return;
    setStatusLoading(true);
    setMsg("");

    try {
      const r = await API.patch(`/admin/status/${selected.complaint._id}`, { status });
      setSelected((prev) => ({
        ...prev,
        complaint: { ...prev.complaint, ...r.data.complaint }
      }));
      await load();
      setMsg("Complaint status updated successfully.");
    } catch (e) {
      setMsg(e.response?.data?.msg || "Could not update status");
    } finally {
      setStatusLoading(false);
    }
  };

  const send = async () => {
    if (!selected || !reply.trim()) return;
    setLoading(true);
    setMsg("");

    try {
      await API.post(`/admin/reply/${selected.complaint._id}`, {
        message: reply,
        status
      });
      setReply("");
      await open(selected.complaint._id);
      await load();
      setMsg("Reply sent and complaint updated.");
    } catch (e) {
      setMsg(e.response?.data?.msg || "Could not send reply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar title="Admin Panel" />
      <main className="app-content">
        <div className="page-head">
          <div>
            <div className="eyebrow">ADMINISTRATION</div>
            <h1>Complaint management</h1>
            <p>Review complaints, update their status, view evidence and reply to students.</p>
          </div>
        </div>

        <div className="stats-grid">
          <Stat label="Total" value={stats.total} />
          <Stat label="Pending" value={stats.pending} />
          <Stat label="In progress" value={stats.progress} />
          <Stat label="Resolved" value={stats.resolved} />
        </div>

        <div className="filters">
          {["", "Pending", "In-Progress", "Resolved"].map((x) => (
            <button
              key={x}
              className={filter === x ? "filter active" : "filter"}
              onClick={() => setFilter(x)}
            >
              {x || "All"}
            </button>
          ))}
        </div>

        {msg && <div className="alert success">{msg}</div>}

        <div className="panel table-wrap">
          <table>
            <thead>
              <tr>
                <th>Complaint</th>
                <th>Student</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c._id}>
                  <td>
                    <strong>#{c._id.slice(-6).toUpperCase()}</strong>
                    <br />
                    <span className="muted">{c.title}</span>
                  </td>
                  <td>
                    {c.student?.name}
                    <br />
                    <span className="muted">{c.student?.email}</span>
                  </td>
                  <td>{c.category}</td>
                  <td><Status s={c.status} /></td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="text-btn" onClick={() => open(c._id)}>Open →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {items.length === 0 && (
            <div className="empty">
              <strong>No complaints found</strong>
            </div>
          )}
        </div>

        {selected && (
          <div className="modal-backdrop">
            <div className="modal panel">
              <button className="modal-close" onClick={() => setSelected(null)}>×</button>

              <div className="eyebrow">
                COMPLAINT #{selected.complaint._id.slice(-6).toUpperCase()}
              </div>
              <h2>{selected.complaint.title}</h2>

              <p>
                <strong>Student:</strong> {selected.complaint.student?.name} ·{" "}
                {selected.complaint.student?.email}
              </p>
              <p><strong>Category:</strong> {selected.complaint.category}</p>

              <div className="complaint-text">{selected.complaint.description}</div>

              {selected.complaint.image && (
                <div className="evidence-preview">
                  <h3>Photo evidence</h3>
                  <a
                    href={imageUrl(selected.complaint.image)}
                    target="_blank"
                    rel="noreferrer"
                    title="Open full-size image"
                  >
                    <img
                      className="attachment admin-evidence"
                      src={imageUrl(selected.complaint.image)}
                      alt="Complaint evidence"
                    />
                  </a>
                </div>
              )}

              <h3>Previous replies</h3>
              {selected.replies.length === 0 ? (
                <p className="muted">No reply yet.</p>
              ) : (
                selected.replies.map((r) => (
                  <div className="reply compact" key={r._id}>
                    <strong>{r.admin?.name || "Admin"}</strong>
                    <p>{r.message}</p>
                  </div>
                ))
              )}

              <label className="field">
                <span>Update status</span>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option>Pending</option>
                  <option>In-Progress</option>
                  <option>Resolved</option>
                </select>
              </label>

              <button
                className="secondary-btn full"
                onClick={updateStatus}
                disabled={statusLoading || status === selected.complaint.status}
              >
                {statusLoading ? "Updating..." : "Update Status"}
              </button>

              <label className="field">
                <span>Reply <small>(optional)</small></span>
                <textarea
                  rows="4"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write a response..."
                />
              </label>

              <button
                className="primary-btn full"
                onClick={send}
                disabled={loading || !reply.trim()}
              >
                {loading ? "Sending..." : "Send Reply"}
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function Stat({ label, value }) {
  return <div className="stat"><span>{label}</span><strong>{value}</strong></div>;
}

function Status({ s }) {
  return (
    <span className={`status ${s === "Resolved" ? "resolved" : s === "In-Progress" ? "progress" : "pending"}`}>
      {s}
    </span>
  );
}
