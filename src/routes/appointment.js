const express = require("express");
const appointmentRouter = express.Router();
const { userAuth, roleAuth } = require("../middlewares/auth");
const Appointment = require("../models/appointment");
const User = require("../models/user");

appointmentRouter.post("/book", userAuth, roleAuth(["Patient"]), async (req, res) => {
  try {
    const { doctorId, date } = req.body;
    const appointment = new Appointment({ patientId: req.user._id, doctorId, date });
    await appointment.save();
    res.send("Appointment booked successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

appointmentRouter.get("/my", userAuth, async (req, res) => {
    try {
      const userId = req.user._id;
      const appointments = await Appointment.find({
        $or: [{ patientId: userId }, { doctorId: userId }],
      }).populate("patientId doctorId", "firstName lastName");
  
      res.send(appointments);
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  });

appointmentRouter.patch("/approve/:appointmentId", userAuth, roleAuth(["Doctor"]), async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body; // expected status values: "Confirmed", "Rejected"
    
    if (!["Confirmed", "Rejected"].includes(status)) {
      throw new Error("Invalid status");
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment || appointment.doctorId.toString() !== req.user._id.toString()) {
      throw new Error("You are not authorized to approve/reject this appointment");
    }

    appointment.status = status;
    await appointment.save();
    res.send(`Appointment ${status.toLowerCase()}`);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});



module.exports = appointmentRouter;