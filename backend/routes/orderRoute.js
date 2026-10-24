const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')

const {
    orderCreate,
    getOrdersByRestaId,
    updateOrderStatus,
    getOrders
} = require('../controller/orderController')

router.get('/orders', authMiddleware, getOrders)
router.post('/create-order', authMiddleware, orderCreate)
router.get('/orders/restaurant', authMiddleware, getOrdersByRestaId)
router.put('/update-status/:id', authMiddleware, updateOrderStatus)
module.exports = router