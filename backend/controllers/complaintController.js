const Complaint = require("../models/Complaint");
const Reply = require("../models/Reply");

exports.create = async (req, res) => {
  try {
    const { category, title, description } = req.body;
    const complaint = await Complaint.create({
      student: req.user.id, category, title, description,
      image: req.file ? req.file.filename : ""
    });
    res.status(201).json({ msg: "Complaint submitted successfully", complaint });
  } catch (e) { res.status(500).json({ msg: e.message }); }
};

exports.mine = async (req, res) => {
  try {
    res.json(await Complaint.find({ student: req.user.id }).sort({ createdAt: -1 }));
  } catch (e) { res.status(500).json({ msg: e.message }); }
};

exports.stats = async (req, res) => {
  try {
    const student = req.user.id;
    const [total, pending, progress, resolved] = await Promise.all([
      Complaint.countDocuments({ student }),
      Complaint.countDocuments({ student, status: "Pending" }),
      Complaint.countDocuments({ student, status: "In-Progress" }),
      Complaint.countDocuments({ student, status: "Resolved" })
    ]);
    res.json({ total, pending, progress, resolved });
  } catch (e) { res.status(500).json({ msg: e.message }); }
};

exports.byId = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate("student", "name email enrollmentNo department");
    if (!complaint) return res.status(404).json({ msg: "Complaint not found" });

    if (req.user.role === "student" && String(complaint.student._id) !== String(req.user.id))
      return res.status(403).json({ msg: "Access denied" });

    const replies = await Reply.find({ complaint: complaint._id })
      .populate("admin", "name")
      .sort({ createdAt: 1 });

    res.json({ complaint, replies });
  } catch (e) { res.status(500).json({ msg: e.message }); }
};