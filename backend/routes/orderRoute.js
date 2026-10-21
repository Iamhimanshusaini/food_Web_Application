const express = require('express')
const router = express.Router()
const orderCreate = require('../controller/orderController')
const authMiddleware = require('../middleware/authMiddleware')


router.post('/create-order', authMiddleware, orderCreate)

module.exports = router