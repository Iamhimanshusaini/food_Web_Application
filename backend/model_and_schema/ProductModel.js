const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    // Restaurant owner
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },

    // Product category
    categoryName: {
      type: String,
      required: true,
    },

    // Basic details
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      lowercase:true
    },

    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    // Pricing
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      min: 0,
      default: null,
    },

    // Product images
    image: {
      type: String,
      required: true,
    },


    // Food details
    foodType: {
      type: String,
      enum: ["veg", "non-veg", "vegan"],
      default: "veg",
      required: true,
    },

    ingredients: {
      type: [String],
      default: [],
    },

    allergens: {
      type: [String],
      default: [],
    },

    preparationTime: {
      type: Number,
      default: 20,
      min: 1,
    },

    servingSize: {
      type: String,
      trim: true,
      default: "1 serving",
    },

    // Availability and inventory
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Product visibility
    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Ratings
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Same restaurant cannot have duplicate product names
productSchema.index(
  { restaurantId: 1, name: 1 },
  { unique: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product