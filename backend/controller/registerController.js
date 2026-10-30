const signupModel = require('../model_and_schema/signupModel')
const crypto = require('crypto')
const transporter = require('../config/nodemailerConfig')
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')
const otpTemplate = require("../utils/otpTemplate")
const welcomeTemplate = require("../utils/welcomeMailTemplate")

const otpStore = new Map()

const addUser = async (req, res) => {

    const formData = req.body
    const email = formData.email
    const name = formData.name
    try {

        if (!formData.name || !formData.email || !formData.phone || !formData.password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        if (formData.password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters",
            });
        }
        const customerExist = await signupModel.findOne({
            email: email
        })
        console.log(customerExist)
        if (customerExist) {
            return res.status(409).json({
                success: false,
                message: 'User already Exist, Please Login.'
            })
        }
        const hashedPassword = await bcrypt.hash(
            formData.password,
            10
        );
        //////////////////////////
        // Generate a 6-digit OTP
        /////////////////////////

        const otp = crypto.randomInt(100000, 1000000)
        console.log(`otp :${otp}`)


        const otpMail = await transporter.sendMail({
            from: process.env.EMAIL_ID,
            to: email,
            subject: "Foodly Email Verification",
            html: otpTemplate(name, otp)
        })

        otpStore.set(email, {
            name: formData.name,
            email: formData.email,
            phone: formData.phone.trim(),
            password: hashedPassword,
            otp: otp,
            expiresAt: Date.now() + 5 * 60 * 1000,
            attempts: 0,

        })
        return res.status(200).json({
            message: "OTP sent. Verify your email to complete signup.",
        });
    } catch (error) {
        console.error("Signup error:", error);

        return res.status(500).json({
            message: "Something went wrong",
        });
    }
}
const forgotPaaword = async (req, res) => {
    const normalizedEmail = req.body.email.toLowerCase().trim()
    try {
        const otp = crypto.randomInt(100000, 1000000).toString()

        const findUser = await signupModel.find({ email: normalizedEmail })

        if (!findUser) {
            res.status(400).json({
                success: false,
                message: 'user record not found'
            })
        }

        const sendMail = await transporter.sendMail({
            from: process.env.EMAILID,
            to: normalizedEmail,
            subject: 'Reset verification Code',
            html: otp
        })
        res.status(200).json({
            message: "Verfication Code send your Registered Email..",
            success: true
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'somethig went worng'
        })
    }

}
const otpVerify = async (req, res) => {

    const { email, fillOtp } = req.body
 
    try {
        if (!email || !fillOtp) {
            return res.status(400).json({
                message: "Email and OTP are required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const pending = otpStore.get(normalizedEmail)

        if (!pending) {
            return res.status(400).json({
                message: "OTP not found. Please signup again.",
            });
        }
        if (Date.now() > pending.expiresAt) {
            otpStore.delete(normalizedEmail);

            return res.status(400).json({
                message: "OTP expired. Please signup again.",
            });
        }
        const findCustomer = await signupModel.findOne({
            email: normalizedEmail
        })
        if (findCustomer) {
            otpStore.delete(normalizedEmail)
            return res.status(409).json({
                message: "Email is already registered",
            });
        }
        //////////////////////////
        // check otp match and not
        //////////////////////////

        console.log(String(fillOtp).trim(), String(pending.otp).trim())

        if (String(fillOtp).trim() === String(pending.otp).trim()) {
            const saveCustomer = await signupModel.create({
                name: pending.name,
                email: pending.email,
                phone: pending.phone.trim(),
                password: pending.password,
                role: pending.role,
                restaurantId: null,
                isEmailVerified: true
            })
            const welcomeMail = await transporter.sendMail({
                from: process.env.EMAIL_ID,
                to: pending.email,
                subject: `🎉 Welcome to Foodly –${saveCustomer.name}`,
                html: welcomeTemplate(saveCustomer.name)
            })
            otpStore.delete(normalizedEmail)

            console.log(saveCustomer)

            return res.status(200).json({
                message: 'Register Succesfuly..',
                success: true,
                saveCustomer,
            })
        } else {
            return res.status(400).json({
                message: "OTP Invaild..",
            });
        }

    } catch (error) {
        console.log(error)
        res.status(401).json({
            success: false,
            message: 'somethings went wrong'
        })
    }

}

module.exports = { addUser, otpVerify, forgotPaaword }