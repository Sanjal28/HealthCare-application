const express = require("express");
const { userAuth, roleAuth } = require("../middlewares/auth");
const adminRouter = express.Router();
const User = require("../models/user");

adminRouter.get("/users", userAuth, roleAuth(["Admin"]), async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

adminRouter.patch("/approve-doctor/:id", userAuth, roleAuth(["Admin"]), async (req, res) => {
    try {
      const doctor = await User.findById(req.params.id);
      if (!doctor || doctor.role !== "Doctor") throw new Error("Doctor not found");
      doctor.isApproved = true;
      await doctor.save();
      res.send("Doctor approved");
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  });

  adminRouter.delete("/reject-doctor/:userId", userAuth, roleAuth(["Admin"]), async (req, res) => {
    try {
      const { userId } = req.params;
      const doctor = await User.findById(userId);
      
      if (!doctor || doctor.role !== "Doctor") {
        throw new Error("Doctor not found");
      }
  
      await User.findByIdAndDelete(userId);
      res.send("Doctor registration rejected");
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  });
  
  
  module.exports = adminRouter;