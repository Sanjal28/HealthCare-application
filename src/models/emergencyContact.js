const mongoose = require("mongoose");

const emergencyContactSchema = mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  relation: { type: String, required: true },
});

const EmergencyContact = mongoose.model("EmergencyContact", emergencyContactSchema);
module.exports = EmergencyContact;
