const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Completed"],
    default: "Pending",
  },
});
const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
