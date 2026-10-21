const express =require("express")
const router = express.Router()
const {addUser,otpVerify} = require("../controller/registerController")
router.post('/signup',addUser)
router.post('/otp-verify',otpVerify)

module.exports = router;