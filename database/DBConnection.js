const mongoose = require("mongoose")

const DBConnection = ()=>{
    mongoose.connect(process.env.DB_URI).then(()=>{
        console.log("Database Connected")
    }).catch((err)=>{
        if(err.code==="ECONNREFUSED"){
            console.log("Internet Not connect")
            return
        }
        console.log("Database not connected")
    })
}

module.exports = DBConnection