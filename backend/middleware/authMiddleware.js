const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        // console.log(authHeader)
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. you are not authorization.",
            });
        }
        const token = authHeader.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decode
        console.log(decode)
        next();
    } catch (error) {
        console.log("JWT ERROR NAME:", error.name);
  console.log("JWT ERROR MESSAGE:", error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }

}
module.exports = authMiddleware;