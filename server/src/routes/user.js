const router = require('express').Router();
const userController = require('../controller/userController')
const authenticate = require('../middleware/authenticate.middleware');
const { upload } = require('../middleware/cloudinary.middleware');
router.post('/login',userController.loginUser)
router.post('/register',userController.registerUser,userController.sendOTP)
router.post('/verifyEmail',userController.verifyOTP)
router.post("/incomeDocuments", authenticate ,upload.single('file'),userController.incomeDocuments);
router.post('/profileImage',authenticate,upload.single('file'),userController.changeProfile)
router.get('/userAvatar',authenticate,userController.changeUserAvatar)
module.exports = router;