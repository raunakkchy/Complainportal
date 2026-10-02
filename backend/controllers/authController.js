const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Admin = require("../models/Admin");

const token = (user, role) => jwt.sign(
  { id: user._id, name: user.name, role },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password, enrollmentNo, department } = req.body;
    if (!name || !email || !password || !enrollmentNo || !department)
      return res.status(400).json({ msg: "All fields are required" });

    if (await Student.findOne({ email: email.toLowerCase() }))
      return res.status(400).json({ msg: "Email already registered" });

    const student = await Student.create({
      name, email: email.toLowerCase(), password: await bcrypt.hash(password, 10),
      enrollmentNo, department
    });
    res.status(201).json({ msg: "Registration successful", id: student._id });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

exports.loginStudent = async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.body.email?.toLowerCase() });
    if (!student || !(await bcrypt.compare(req.body.password || "", student.password)))
      return res.status(400).json({ msg: "Invalid credentials" });

    res.json({
      token: token(student, "student"),
      user: { id: student._id, name: student.name, email: student.email, role: "student" }
    });
  } catch (e) { res.status(500).json({ msg: e.message }); }
};

exports.loginAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email?.toLowerCase() });
    if (!admin || !(await bcrypt.compare(req.body.password || "", admin.password)))
      return res.status(400).json({ msg: "Invalid credentials" });

    res.json({
      token: token(admin, "admin"),
      user: { id: admin._id, name: admin.name, email: admin.email, role: "admin" }
    });
  } catch (e) { res.status(500).json({ msg: e.message }); }
};