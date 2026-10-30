const CustomerModel = require('../model_and_schema/signupModel')
const RestaurantModel = require("../model_and_schema/RestaurantModel")
const OrderModel = require('../model_and_schema/orderModel')
const mongoose = require('mongoose')
const restaurantApprovedTemplate = require("../utils/restaurantApprovalTemplate")
const restaurantRejectedTemplate = require("../utils/restaurantRejectedTemplate")
const transporter = require('../config/nodemailerConfig')

const getAllCustomer = async (req, res) => {
    try {
        const customers = await CustomerModel.find()

        if (!customers) {
            return res.status(404).json({
                success: true,
                message: "record Not Found",
            })
        }
        res.status(200).json({
            success: true,
            message: "finded done ",
            customers
        })
    } catch (error) {
        res.status(400).json({
            message: 'somethig went worng',
            success: false
        })
    }
}
const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await RestaurantModel.find()
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            restaurants,
        });
    } catch (error) {
        console.error("Get restaurants error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch restaurants",
        });
    }
};
// Approve restaurant
const approveRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const { isApproved, rejectionReason } = req.body;

        // Validate restaurant ID
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid restaurant ID",
            });
        }

        // Validate approval status
        if (typeof isApproved !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isApproved must be true or false",
            });
        }

        // Find and update restaurant
        const restaurant = await RestaurantModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    isApproved: isApproved,
                },
            },
            {
                returnDocument: "after",
                runValidators: true,
            }
        );

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found",
            });
        }

        // Find restaurant owner
        const owner = await CustomerModel.findById(restaurant.ownerId);

        let emailSent = false;

        // Send email to restaurant owner
        if (owner?.email) {
            try {
                let subject;
                let html;

                if (isApproved === true) {

                    // APPROVAL EMAIL
                    subject = "🎉 Your Restaurant Has Been Approved - Foodly";

                    html = restaurantApprovedTemplate({
                        ownerName: owner.name,
                        restaurantName: restaurant.name,
                        dashboardUrl: process.env.RESTAURANT_DASHBOARD_URL,
                    });

                } else {

                    // REJECTION EMAIL
                    subject = "Restaurant Application Update - Foodly";

                    html = restaurantRejectedTemplate({
                        ownerName: owner.name,
                        restaurantName: restaurant.name,
                        rejectionReason:
                            rejectionReason ||
                            "Please contact our support team for details.",
                        supportEmail: process.env.SUPPORT_EMAIL,
                    });
                }

                await transporter.sendMail({
                    from: `"Foodly" <${process.env.EMAIL_USER}>`,
                    to: owner.email,
                    subject,
                    html,
                });

                emailSent = true;

            } catch (mailError) {
                console.error("Restaurant notification email failed:", mailError);
            }
        }

        return res.status(200).json({
            success: true,
            message: isApproved
                ? "Restaurant approved successfully"
                : "Restaurant rejected successfully",
            emailSent,
            restaurant,
        });

    } catch (error) {
        console.error("Approve restaurant error:", error);

        return res.status(500).json({
            success: false,
            message: `Failed to update restaurant: ${error.message}`,
        });
    }
};
const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await CustomerModel.findByIdAndDelete(id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        // Agar customer ka restaurant hai, to use bhi delete karo

        if (customer.restaurantId) {
            await RestaurantModel.findByIdAndDelete(customer.restaurantId);
        }

        return res.status(200).json({
            success: true,
            message: "Customer and associated restaurant deleted successfully",
        });
    } catch (error) {
        console.error("Delete customer error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete customer",
            error: error.message,
        });
    }
};
const getOrderById = async (req, res) => {
    const { id } = req.params

    try {
        const orders = await OrderModel.find({ orderId: id }).populate("items.restaurantId")

        if (!orders) {
            return res.status(404).json({
                success: true,
                message: "record Not Found",
            })
        }
        res.status(200).json({
            success: true,
            message: "finded done ",
            orders
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: 'somethig went worng',
            success: false
        })
    }
}
const superAdminOrder = async (req, res) => {
    try {
        const orders = await OrderModel.find()
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
module.exports = {
    getAllRestaurants,
    approveRestaurant, getAllCustomer, deleteCustomer, getOrderById,superAdminOrder
}