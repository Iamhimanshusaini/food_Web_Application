
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

module.exports = orderCreate