const asyncHandler = require("../middleware/asyncHandler");
const Admin = require("../models/admin");
const mongoose = require("mongoose")
require("dotenv").config()

const admininitialize = asyncHandler(async () => {
  await mongoose.connect(process.env.DB_URI).then(()=>{
    console.log("Database Connected")
  }).catch((err)=>{
    console.log("Database not connected")
    console.log(`${err}`)
    process.exit(1)
  })
  await Admin.deleteMany()
    const findAdminByAlreadyAxist = await Admin.find({email: "ansarisageer972@gmail.com"})
    if(findAdminByAlreadyAxist.length !==0) {
      console.log("Admin Already exist")
      process.exit(1)

    }
    await Admin.create({
        name:"admin",
        email:"ansarisageer972@gmail.com",
        password:"12345678",
        role: "Admin",
        mobile:1234567890,
        })
    process.exit(1)
});


admininitialize()