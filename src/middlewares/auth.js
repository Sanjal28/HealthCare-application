const jwt=require("jsonwebtoken");
const User=require("../models/user");
require("dotenv").config();

const userAuth=async(req,res,next)=>{
    // middleware to check if user is authenticated
    try{
        const {token}=req.cookies;
        if(!token){
            return res.status(401).send("Please login");
        }
        const decodedObj=await jwt.verify(token,process.env.JWT_SECRET);
        const {_id}=decodedObj;
        const user=await User.findById(_id);
        if(!user){
            throw new Error("User is not found");
        }
        req.user=user;
        next();
    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
} 


const roleAuth = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).send("Access denied");
    next();
  };

module.exports={userAuth,roleAuth};