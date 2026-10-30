const express = require("express")
const router = express.Router()
const { addUser, otpVerify, forgotPaaword } = require("../controller/registerController")



router.post('/signup', addUser)
router.post('/otp-verify', otpVerify)
router.post("/forgot-password", forgotPaaword)

module.exports = router;