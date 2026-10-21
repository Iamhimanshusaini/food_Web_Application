const signupModel = require('../model_and_schema/signupModel')
const jwt = require('jsonwebtoken')

const bcrypt= require('bcrypt')
const loginUser = async (req, res) => {
    try {
        const formData= req.body;

        // 1. Validate fields
        if (!formData.email || !formData.password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // 2. Normalize email
        const normalizedEmail = formData.email.trim().toLowerCase();

        // 3. Find customer in MongoDB
        const customer = await signupModel.findOne({
            email: normalizedEmail,
        });

        if (!customer) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // 4. Check email verification
        if (!customer.isEmailVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email first",
            });
        }

        // 5. Compare entered password with hashed password
        const isPasswordMatch = await bcrypt.compare(
            formData.password,
            customer.password
        );

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // 6. Generate JWT token

        const token = jwt.sign(
            {
                id: customer._id,
                email: customer.email,
                restaurantId:customer.restaurantId
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "24h",
            }
        );

        // 7. Remove password from response
        const customerData = customer.toObject();
        delete customerData.password;

        // 8. Send response
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            customerUser: customerData,
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

module.exports= loginUser