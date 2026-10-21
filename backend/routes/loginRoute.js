const express = require("express")
const router = express.Router()
const loginUser = require('../controller/loginUserController')
const authMiddleware = require('../middleware/authMiddleware')


router.post('/login', loginUser)

module.exports = router