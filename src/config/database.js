const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://sanjal:sanjal2004@cluster0.b3gog.mongodb.net/healthCare-app"
  );
};
 module.exports = connectDB;
