const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_ID,
        pass:process.env.EMAIL_PASS
    }
})

transporter.verify((error,success)=>{
    if(error){
        console.log('SMPT NOT CONNECTED')

    }
    if(success){
        console.log('SMPT CONNECTED')
    }
})

module.exports = transporter