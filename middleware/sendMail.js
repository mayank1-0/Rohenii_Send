const nodemail = require("nodemailer")
require("dotenv").config({path:"../.env"})

const sendMail = async(option)=>{
    const {email  , message , subject,condidate} = option;
console.log(process.env.MAIL_SERVICE,"process.env.MAIL_SERVICE")
    const transport = await nodemail.createTransport({
        host: process.env.MAIL_SERVICE,
        port: 587,               
        secure: false,
        auth: {
          user: process.env.PREV_EMAIL_ADMIN,
          pass: process.env.PREV_EMAIL_PASS,
        },
      });


    const mailOption = {
        from:process.env.PREV_EMAIL_ADMIN,
        to:condidate && Array.isArray(email) ? email.map(mails => mails.email) : email,
        subject:subject,
        html:message
    }
    await transport.sendMail(mailOption,(err,success)=>{
        if(err){
            console.log("err",err)
        }
        console.log("info",success)
    })
}

module.exports = sendMail