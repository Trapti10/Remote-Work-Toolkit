const express = require('express');
const router = express.Router();
const {body} = require('express-validator')
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const User = require('../models/user.model')

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min: 3}).withMessage('First name must be at least 3 character long'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 character long')
],
userController.registerUser
)

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 character long')
], 
 userController.loginUser
)

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("_id email fullname");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/profile',authMiddleware.authUser, userController.getUserProfile);

router.get('/logout', userController.logoutUser);

module.exports = router;