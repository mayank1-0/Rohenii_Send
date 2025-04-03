const asyncHandler = require("../middleware/asyncHandler");
const Policy = require("../models/policy");
const mongoose = require("mongoose")
require("dotenv").config()

const policyinitialize = asyncHandler(async () => {
  await mongoose.connect(process.env.DB_URI).then(()=>{
    console.log("Database connected")
  }).catch((err)=>{
    console.log("Database not connected")
    process.exit(1)
  })
    const findPolicyByAlreadyAxist = await Policy.find({})
    if(findPolicyByAlreadyAxist.length !==0) {
      console.log("Policy Already exists")
      process.exit(1)

    }
    await Policy.create({
        name:"policy",
        email:"policy@gmail.com",
        password:"12345",
        mobile:1234567890,
        })
    console.log("Policy init Successfully \n policy Infomation \n name=>policy\n email=>policy@gmail.com\npassword=>sag@123456")
    process.exit(1)
});


policyinitialize()