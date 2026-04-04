const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const BlacklistTokenModel = require('../models/blcklistToken.model')

module.exports.registerUser = async (req, res, next) => {

     console.log("BODY:", req.body);

    const { fullname, email, password } = req.body;

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    const existingUser = await userModel.findOne({ email });
   if (existingUser) {
     return res.status(409).json({ message: "User already registered" });
   }
    
    const hashPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname: fullname?.firstname,
        lastname: fullname?.lastname || "",
        email,
        password: hashPassword
    });

    const token = user.generateAuthToken();

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.__v;

    res.status(201).json({ token, user: userObj });
}

module.exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }
    

    const user = await userModel.findOne({ email }).select('+password');

    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: "Inavalid email or password" });
    }

    const token = user.generateAuthToken();

    // convert mongoose doc → plain object
    const userObj = user.toObject();

    // remove password
    delete userObj.password;
    delete userObj.__v;

    res.cookie("token", token);
    res.status(200).json({ token, user: userObj });

}

module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user);
}

module.exports.logoutUser = async (req, res) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];

    await BlacklistTokenModel.create({ token });

    res.status(200).json({ message: "Logged Out" });
}