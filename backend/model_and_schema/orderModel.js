const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            require: true
        },
        // Customer details
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },
        customer: {
            type: String,
            required: true
        },

        // Ordered products
        items: [
            {
                // product: {
                //     type: mongoose.Schema.Types.ObjectId,
                //     ref: "Product",
                //     required: true,
                // },
                restaurantId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Restaurant",
                    required: true,
                },

                name: {
                    type: String,
                    required: true,
                },

                image: {
                    type: String,
                    default: "",
                },

                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },

                subtotal: {
                    type: Number,
                    // required: true,
                    min: 0,
                },
            },
        ],

        // Delivery address
        deliveryAddress: {
            fullName: {
                type: String,
                // required: true,
            },

            phone: {
                type: String,
                // required: true,
            },

            address: {
                type: String,
                // required: true,
            },

            city: {
                type: String,
                // required: true,
            },

            state: {
                type: String,
                default: "",
            },

            pincode: {
                type: String,
                // required: true,
            },

            landmark: {
                type: String,
                default: "",
            },
        },

        // Price details
        subtotal: {
            type: Number,
            // required: true,
            min: 0,
        },

        deliveryCharge: {
            type: Number,
            default: 0,
            min: 0,
        },

        tax: {
            type: Number,
            default: 0,
            min: 0,
        },

        discount: {
            type: Number,
            default: 0,
            min: 0,
        },

        totalAmount: {
            type: Number,
            // required: true,
            min: 0,
        },

        // Payment details
        paymentMethod: {
            type: String,
            enum: ["cod", "RAZORPAY"],
            default: "COD",
            // lowercase: true,
            trim: true,
        },

        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
            default: "PENDING",
            // lowercase: true,
        },

        razorpayOrderId: {
            type: String,
            default: null,
        },

        razorpayPaymentId: {
            type: String,
            default: null,
        },

        // Order and delivery status
        orderStatus: {
            type: String,
            enum: [
                "pending",
                "Confirmed",
                "preparing",
                "ready",
                "picked_up",
                "out_for_delivery",
                "cancelled",
                "rejected",
                "refunded"
            ],
            default: "PLACED",
        },

        deliveryBoy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DeliveryBoy",
            default: null,
        },

        estimatedDeliveryTime: {
            type: Date,
            default: null,
        },

        deliveredAt: {
            type: Date,
            default: null,
        },

        cancelledAt: {
            type: Date,
            default: null,
        },

        specialInstructions: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel