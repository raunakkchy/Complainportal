const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  complaint: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint", required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  message: { type: String, required: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model("Reply", schema);