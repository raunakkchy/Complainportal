const Complaint = require("../models/Complaint");
const Reply = require("../models/Reply");

exports.stats = async (req, res) => {
  try {
    const [total, pending, progress, resolved] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: "Pending" }),
      Complaint.countDocuments({ status: "In-Progress" }),
      Complaint.countDocuments({ status: "Resolved" })
    ]);
    res.json({ total, pending, progress, resolved });
  } catch (e) { res.status(500).json({ msg: e.message }); }
};

exports.all = async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const complaints = await Complaint.find(filter)
      .populate("student", "name email enrollmentNo department")
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (e) { res.status(500).json({ msg: e.message }); }
};


exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Pending", "In-Progress", "Resolved"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ msg: "Invalid complaint status" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate("student", "name email enrollmentNo department");

    if (!complaint) {
      return res.status(404).json({ msg: "Complaint not found" });
    }

    res.json({ msg: "Complaint status updated successfully", complaint });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

exports.reply = async (req, res) => {
  try {
    const { message, status } = req.body;
    if (!message?.trim()) return res.status(400).json({ msg: "Reply message is required" });

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ msg: "Complaint not found" });

    await Reply.create({ complaint: complaint._id, admin: req.user.id, message: message.trim() });
    if (status) complaint.status = status;
    await complaint.save();

    res.json({ msg: "Reply sent and complaint updated" });
  } catch (e) { res.status(500).json({ msg: e.message }); }
};