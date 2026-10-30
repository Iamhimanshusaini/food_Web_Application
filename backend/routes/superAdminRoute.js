const express = require("express")
const router = express.Router()
const { getAllCustomer, deleteCustomer, getOrderById,
    getAllRestaurants,
    approveRestaurant, superAdminOrder
} = require('../controller/superAdminController')
const AuthMidleware = require("../middleware/authMiddleware")


router.get('/super-admin/orders', AuthMidleware, superAdminOrder)
router.get('/customer/all', AuthMidleware, getAllCustomer)
router.get('/super-admin/restaurants', AuthMidleware, getAllRestaurants)


router.put("/super-admin/restaurants/:id/approve", AuthMidleware, approveRestaurant)
router.get('/order/:id', AuthMidleware, getOrderById)


router.delete('/customer/:id', AuthMidleware, deleteCustomer)

module.exports = router