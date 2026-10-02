const jwt = require("jsonwebtoken");

module.exports = (role) => (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ msg: "Authentication required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (role && decoded.role !== role) return res.status(403).json({ msg: "Access denied" });
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};