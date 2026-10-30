const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    // Restaurant basic details
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    // Restaurant location / area
    location: {
      type: String,
      required: false,
      trim: true,
    },

    // Multiple cuisines
    cuisine: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => value.length > 0,
        message: "At least one cuisine is required",
      },
    },

    // Restaurant image URL
    image: {
      type: String,
      default: "",
    },

    // Rating
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // Estimated delivery time
    deliveryTime: {
      type: String,
      default: "30-40 min",
    },

    // Delivery charges in rupees
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Discount / offer text
    offer: {
      type: String,
      default: "",
    },

    // Restaurant owner reference
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    // Admin approval
    isApproved: {
      type: Boolean,
      default: false,
    },
    openingTime: {
      type: String,
      default: "09:00 AM"
    },
    closingTime: {
      type: String,
      default: "11:00 PM"
    },
    isOpen: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;