const express = require("express")
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cors = require('cors')
dotenv.config()
const app = express()
const  UserRegister = require("./routes/registerRoute")
const userLogin = require("./routes/loginRoute")
const DBConn =require('./config/dbConfig')
const transporter = require('./config/nodemailerConfig')
const orderCreateRoute = require("./routes/orderRoute")
const RestaurantAdd = require('./routes/restaurantRoute')
app.use(cors());
app.use(express.json());

app.use("/api/customer",orderCreateRoute)
app.use("/api/customer",RestaurantAdd)
app.use("/api/customer",UserRegister)
app.use("/api/customer",userLogin)


app.get("/",(req,res)=>{
res.send('woriking home path')
})
app.listen(process.env.PORT,()=>{
    console.log(`server running .. :${process.env.PORT}`)
})