const User =require("../models/user")


const searchUser=async(req,res)=>{

    try{
        const {username,email}=req.query;

        if(!username||!email)return res.status(400).json({message:"Povide Username and Email"});

        const user =await User.findOne({
            $or:[{username},{email}],
        }).select("-password")

        if(!user)return res.status(400).json({message:"User Doesn't Exist"});

        res.json(user);
    }
    catch(error){
        res.status(500).json({ message: "Server error", error });
    }
}

module.exports={searchUser};