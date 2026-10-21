const Customer = require('../model_and_schema/signupModel');
const Restaurant = require("../model_and_schema/RestaurantModel");
const CategoryModel = require('../model_and_schema/categoryModel')
const ProductModel = require('../model_and_schema/ProductModel')

const createRestaurant = async (req, res) => {
  let restaurant;

  try {
    const userId = req.user.id; // JWT middleware se aayega

    const { name, phone, email, address, location, cuisine, image, rating, deliveryTime, deliveryFee, offer } = req.body;

    if (!name || !phone || !email || !address || !cuisine) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const user = await Customer.findById(userId);
    console.log(user)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Ek user ke liye ek restaurant
    if (user.restaurantId) {
      return res.status(409).json({
        success: false,
        message: "You have already created a restaurant",
      });
    }

    // Restaurant create
    restaurant = await Restaurant.create({
      name,
      phone,
      email,
      address,
      cuisine,
      location,
      image: image || "",
      ownerId: user._id,
      rating,
      deliveryTime,
      deliveryFee,
      offer,
      isOpen:true,
      isApproved: false,
    });

    // User document mein restaurant ki ID save
    user.restaurantId = restaurant._id;

    console.log(user)
    // Restaurant owner ko owner role do.
    // Agar sirf super-admin restaurants create karega,
    // to apni role policy ke hisaab se is line ko badlo.
    if (user.role === "user") {
      user.role = "restaurantOwner";
    }

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Restaurant created successfully. Awaiting approval.",
      restaurant,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId,
      },
    });
  } catch (error) {
    // User update fail ho jaye to orphan restaurant hata do
    if (restaurant?._id) {
      await Restaurant.findByIdAndDelete(restaurant._id).catch(() => { });
    }

    console.error("Create restaurant error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create restaurant",
    });
  }
}
const createCategory = async (req, res) => {
  const { categoryName, emoji } = req.body
  const id = req.user.id

  try {
    const user = await Customer.findById(id)
    if (!user.restaurantId) {
      return res.status(401).json({
        message: 'first create restaurant..',
        success: false
      })
    }

    const restaurantId = user.restaurantId

    console.log(restaurantId, req.user)
    const category = await CategoryModel.create({
      name: categoryName,
      emoji: emoji,
      restaurantId: restaurantId
    })
    res.status(201).json({
      message: 'category added succesfuly',
      success: true,
      category
    })

  } catch (error) {
    console.log(error)
    res.status(401).json({
      message: error.message || "something went worng",
      success: false,
    })
  }
}
const productCreate = async (req, res) => {
  const formData = req.body
  const RestaurantId = req.user.restaurantId
  formData.restaurantId = RestaurantId
  try {
    if (!formData.name) {
      return res.status(401).json({
        message: 'all field are require',
        successs: false
      })
    }
    const newProduct = await ProductModel.create(formData)
    if (!newProduct) {
      return res.status(401).json({
        message: 'product not create',
        success: false
      })
    }

    res.status(200).json({
      message: 'Product added successfully.',
      success: true,
      newProduct
    })
  } catch (error) {
    console.log(error)
    return res.status(401).json({
      message: error.message || 'not added',
      success: false
    })
  }
}
const getAllRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.find()
    res.status(201).json({
      success: true,
      message: 'find all',
      restaurant
    })
  } catch (error) {
    console.log(error)
  }
}
const getRestaurantById = async (req, res) => {

  const { id } = req.params
  console.log(id)
  try {
    const restaurant = await Restaurant.findById({ _id: id })
    console.log(restaurant)
    res.status(201).json({
      message: 'finded..',
      restaurant
    })
  } catch (error) {
    console.log(error)
  }
}

const getProductsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!mongoose.isValidObjectId(restaurantId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant ID",
      });
    }

    const products = await ProductModel.find({
      restaurantId,
    }).lean();

    return res.status(200).json({
      success: true,
      count: products.length,
      foods,
    });
  } catch (error) {
    console.error("Fetch products error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};
const getAllCategory = async (req, res) => {
  try {
    const categories = await CategoryModel.find()
    res.status(201).json({
      success: true,
      message: 'find all',
      categories
    })
  } catch (error) {
    console.log(error)
  }
}
const getCategoryByRetaId = async (req, res) => {
  const restaurantId = req.user.restaurantId
  console.log(restaurantId)
  try {
    const restaurantCategory = await CategoryModel.find({ restaurantId: restaurantId })
    if (!restaurantCategory) {
      return res.status(400).json({
        message: 'category not found',
      })
    }
    res.status(201).json({
      message: 'finded',
      success: true,
      restaurantCategory
    })
  } catch (error) {
    console.log(error.message)
    res.status(401).json({
      message: error.message,
      success: false,
    })
  }
}
const getProductByRetaId = async (req, res) => {
  const restaurantId = req.user.restaurantId
  try {
    const restaurantProduct = await ProductModel.find({ restaurantId: restaurantId })
    if (!restaurantProduct) {
      return res.status(400).json({
        message: 'Product not found',
      })
    }
    res.status(201).json({
      message: 'finded',
      success: true,
      restaurantProduct
    })
  } catch (error) {
    console.log(error.message)
    res.status(401).json({
      message: error.message,
      success: false,
    })
  }
}
const getcateDeleteById = async (req, res) => {
  const id = req.params.id
  try {
    const deleteCate = await CategoryModel.findByIdAndDelete(id)

    if (!deleteCate) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: `Category "${deleteCate.name}" successfully deleted`,
      category: deleteCate,
    });
  } catch (error) {
    console.log(error.message)
    res.status(401).json({
      message: error.message,
      success: false
    })
  }
}
const getProductDeleteById = async (req, res) => {
  const id = req.params.id
  try {
    const deleteProduct = await ProductModel.findByIdAndDelete(id)

    if (!deleteProduct) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: `Category "${deleteProduct.name}" successfully deleted`,
      deleteProduct: deleteProduct,
    });
  } catch (error) {
    console.log(error.message)
    res.status(401).json({
      message: error.message,
      success: false
    })
  }
}
const getProductUpdateById = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      req.body,
      { returnDocument: "after" }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updatedProduct,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getAllProduct = async (req, res) => {
  try {
    const foods = await ProductModel.find()
    res.status(201).json({
      success: true,
      message: 'find all',
      foods
    })
  } catch (error) {
    console.log(error)
  }
}
module.exports = { createRestaurant, getAllRestaurant, getRestaurantById, createCategory, getAllCategory, getCategoryByRetaId, getcateDeleteById, productCreate, getProductByRetaId, getProductDeleteById, getProductUpdateById, getAllProduct, }