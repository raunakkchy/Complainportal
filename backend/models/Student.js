const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  enrollmentNo: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model("Student", schema);