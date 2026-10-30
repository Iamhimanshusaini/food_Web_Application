const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


async function checkConnection() {
    try {
        const result = await cloudinary.api.ping();

        console.log("✅ Cloudinary connected successfully!");
        console.log(result);
    } catch (error) {
        console.log("❌ Cloudinary connection failed!");
        console.log(error.message);
    }
}

checkConnection();
module.exports = cloudinary