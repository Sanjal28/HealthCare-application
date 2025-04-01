const express = require("express");
const { userAuth, roleAuth } = require("../middlewares/auth");
const EmergencyContact = require("../models/emergencyContact");
const patientRouter = express.Router();

patientRouter.post("/emergency-contact", userAuth, roleAuth(["Patient"]), async (req, res) => {
  try {
    const { name, phone, relation } = req.body;
    
    const contact = new EmergencyContact({
      patientId: req.user._id,
      name,
      phone,
      relation,
    });

    await contact.save();
    res.send("Emergency contact added successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

patientRouter.get("/emergency-contacts", userAuth, roleAuth(["Patient"]), async (req, res) => {
    try {
      const contacts = await EmergencyContact.find({ patientId: req.user._id });
  
      res.send(contacts);
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  });
  
  

module.exports = patientRouter;
