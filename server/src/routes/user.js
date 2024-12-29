const router = require('express').Router();
const userController = require('../controller/userController')
const authenticate = require('../middleware/authenticate.middleware')
router.post('/login',userController.loginUser)
router.post('/register',userController.registerUser,userController.sendOTP)
router.post('/verifyEmail',userController.verifyOTP)

module.exports = router;