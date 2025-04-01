const mongoose = require("mongoose");

const prescriptionSchema = mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  medicine: { type: String, required: true },
  dosage: { type: String, required: true },
  instructions: { type: String },
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);
module.exports = Prescription;
