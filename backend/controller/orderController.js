
const OrderModel = require('../model_and_schema/orderModel')

const orderCreate = async (req, res) => {
    const orderData = req.body

    try {
        // if (!orderData) {
        //     res.status(401).json({
        //         message: 'all field are require',
        //         success: false
        //     })
        // }

        const newOrder = await OrderModel.create(orderData)
        if (newOrder) {
            res.status(200).json({
                message: "your order succesfuly order",
                success: true,
                newOrder
            })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: error.message || 'something went worng Pelese try again',
            success: false
        })
    }
}

const getOrdersByRestaId = async (req, res) => {
    const restaurantId = req?.user?.restaurantId
    console.log(restaurantId)
    try {
        if (!restaurantId) {
            return res.status(401).json({
                message: "not auth member",
                success: false,

            })
        }
        const orders = await OrderModel.find({ "items.restaurantId": restaurantId })
        if (!orders) {
            return res.status(401).json({
                message: "order not found",
                success: false,

            })
        }
        res.status(201).json({
            message: "finded...",
            success: true,
            orders
        })
    } catch (error) {
        res.status(401).json({
            message: "not found",
            success: false,
        })
    }
}
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const normalizedStatus = status?.trim().toLowerCase();
    try {
        if (!id) {
            return res.status(400).json({
                message: "Order ID is required",
                success: false,
            });
        }

        const updatedOrder = await OrderModel.findByIdAndUpdate(
            id,
            { orderStatus: normalizedStatus },
            { returnDocument: 'after', runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                message: "Order not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Order status updated successfully",
            success: true,
            order: updatedOrder,
        });

    } catch (error) {
        console.error("Update order status error:", error);

        return res.status(500).json({
            message: "Failed to update order status",
            success: false,
        });
    }
};
const getOrders = async(req, res) => {
    try {
        const orders = await OrderModel.find()
        if (!orders) {
            return res.status(401).json({
                message: "Order not found",
                success: false,

            })
        }
        res.status(201).json({
            message: "finded...",
            success: true,
            orders
        })
    } catch (error) {
        res.status(400).json({
            message: "not found",
            success: false,
        })
    }
}
module.exports = {
    orderCreate,
    getOrdersByRestaId,
    updateOrderStatus,
    getOrders
}