const mongoose = require('mongoose')
const dbconn = mongoose.connect(process.env.DB_URL)
.then(()=>{
    console.log('db connected')
})
.catch((error)=>{
    console.log(`db not connected ${error}`)
})
module.exports =dbconn