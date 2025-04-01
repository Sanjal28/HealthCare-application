const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
      index: true,
    },
    lastName: {
      type: String,
      maxlength: 30,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong");
        }
      },
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      minLength: [10, "Phone Number must contains exactly 10 digits"],
      maxLength: [10, "Phone Number must contains exactly 10 digits"],
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      // required: true,
      enum: {
        values: ["male", "female", "others"],
        message: `{VALUE} is not valid gender`,
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.pnrao.com/wp-content/uploads/2023/06/dummy-user-male.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("URL is not valid");
        }
      },
    },
    address: {
      type: String,
    },
    dob: {
      type: Date,
      // required: [true, "DOB Is Required!"],
    },
    role: {
      type: String,
      enum: ["Admin", "Patient", "Doctor"],
      required: true,
    },
    appointments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    ],
    isApproved: { type: Boolean, default: false },
    emergencyContact: { type: String },
  },
  {
    timestamps: true,
  }
);
// methods to create jwt token
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};
// method to encrypt password
userSchema.methods.validatePassword = async function (receivedPassword) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(receivedPassword, passwordHash);
  return isPasswordValid;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
