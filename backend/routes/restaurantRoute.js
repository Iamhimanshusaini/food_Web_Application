
const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const {
  createRestaurant,
  getAllRestaurant,
  getRestaurantById,
  createCategory,
  getAllCategory,
  getCategoryByRetaId,
  getcateDeleteById,
  productCreate,
  getProductByRetaId,
  getProductDeleteById,
  getProductUpdateById,
  getAllProduct,
} = require("../controller/restaurantController");



// Logged-in user / restaurant owner routes

router.get('/restaurant/categories', getAllCategory)
router.get('/restaurant/foods', getAllProduct)
router.get('/restaurants', getAllRestaurant)

router.post("/create-restaurant", authMiddleware, createRestaurant);

router.post('/restaurant/category-create', authMiddleware, createCategory)
router.get('/restaurant/categories/category', authMiddleware, getCategoryByRetaId)
router.get('/restaurant/restaurant-Products', authMiddleware, getProductByRetaId)

router.post('/restaurant/create-product', authMiddleware, productCreate)

router.get('/restaurant/:id', getRestaurantById)
router.delete('/restaurant/categories/:id', authMiddleware, getcateDeleteById)
router.delete('/restaurant/product/:id', authMiddleware, getProductDeleteById)
router.put("/restaurant/product/update/:id", authMiddleware, getProductUpdateById)


module.exports = router;
