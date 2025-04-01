const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {validateSignUpData} = require("../utils/validate");


// signup user
authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password, phone } = req.body;
  try {
    // validating the user data
    validateSignUpData(req);

    // password encr
    const passwordHash = await bcrypt.hash(password, 10);

    // creating a new instance of User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      phone,

    });

    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.send("Error in creating user!!! " + err.message);
  }
});

// login user
authRouter.post("/login", async (req, res) => {
    try {
      const { emailId, password } = req.body;
      const user = await User.findOne({ emailId: emailId });
      if (!user) {
        throw new Error("Inavalid credentials");
      }
      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      } else {
        // create a jwt token
        const token = await user.getJWT();
        res.cookie("token", token);
        // add token to the cookie and send it to the user
  
        res.send(user);
      }
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  });

// logout user
authRouter.post("/logout",async(req,res)=>{
    try{
        res.cookie("token",null,{
            expires:new Date(Date.now()),
        })
        res.send("User logged out successfully");
    }catch(err){
        res.status(400).send("ERROR: Something went wrong");
    }
})

module.exports=authRouter;
