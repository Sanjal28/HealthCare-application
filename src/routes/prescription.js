const express = require("express");
const { userAuth, roleAuth } = require("../middlewares/auth");
const Prescription = require("../models/prescription");
const prescriptionRouter = express.Router();

prescriptionRouter.post("/add", userAuth, roleAuth(["Doctor"]), async (req, res) => {
  try {
    const { patientId, medicine, dosage, instructions } = req.body;
    
    if (!patientId || !medicine || !dosage) {
      throw new Error("Missing required fields");
    }

    const prescription = new Prescription({
      doctorId: req.user._id,
      patientId,
      medicine,
      dosage,
      instructions,
    });

    await prescription.save();
    res.send("Prescription written successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = prescriptionRouter;
