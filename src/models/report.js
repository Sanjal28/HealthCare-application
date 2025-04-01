const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: String, required: true },
});

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
