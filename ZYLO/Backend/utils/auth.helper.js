const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken");

const verifyUserFromToken = async(token) =>{
    if(!token){
        return null;
    }

    const isBlackListed =  await userModel.findOne({token : token});

    if(isBlackListed){
       return null;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);
        return user;
        
    } catch (error) {
        return null;
    }   
}

module.exports = verifyUserFromToken;