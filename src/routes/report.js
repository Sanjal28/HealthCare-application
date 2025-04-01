// routes/report.js
const express = require("express");
const { userAuth, roleAuth } = require("../middlewares/auth");
const Report = require("../models/report");
const multer = require("multer");
const reportRouter = express.Router();

// Set up file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

reportRouter.post(
  "/upload",
  userAuth,
  roleAuth(["Patient"]),
  upload.single("report"),
  async (req, res) => {
    try {
      const { patientId } = req.body;
      if (!req.file) throw new Error("No file uploaded");

      const report = new Report({
        patientId,
        fileUrl: `/uploads/${req.file.filename}`,
        uploadedBy: req.user.firstName + " " + req.user.lastName,
      });

      await report.save();
      res.send("Medical report uploaded successfully");
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

reportRouter.get("/view/:patientId", userAuth, roleAuth(["Doctor", "Patient"]), async (req, res) => {
  try {
    const { patientId } = req.params;
    const reports = await Report.find({ patientId }).populate("patientId", "firstName lastName");

    res.send(reports);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = reportRouter;


module.exports = reportRouter;
