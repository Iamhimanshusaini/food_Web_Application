const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    // Category name
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // Category image
    emoji: {
      type: String,
      default: "",
    },

  

    // Which restaurant owns this category
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    // Category active or inactive
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate category names within the same restaurant
categorySchema.index(
  { restaurantId: 1, name: 1 },
  { unique: true }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;