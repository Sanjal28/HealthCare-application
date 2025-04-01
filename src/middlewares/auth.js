const jwt=require("jsonwebtoken");
const User=require("../models/user");

const userAuth=async(req,res,next)=>{
    // middleware to check if user is authenticated
    try{
        const {token}=req.cookies;
        if(!token){
            return res.status(401).send("Please login");
        }
        const decodedObj=await jwt.verify(token,"sanjal@20042004");
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
module.exports={userAuth};