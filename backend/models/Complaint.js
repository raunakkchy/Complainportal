const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  category: { type: String, required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  image: { type: String, default: "" },
  status: {
    type: String,
    enum: ["Pending", "In-Progress", "Resolved"],
    default: "Pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Complaint", schema);