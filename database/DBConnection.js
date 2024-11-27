const mongoose = require("mongoose")


const DBConnection = ()=>{
    mongoose.connect(process.env.DB_URI).then(()=>{
        console.log("database Connected")
    }).catch((err)=>{
        if(err.code==="ECONNREFUSED"){
            console.log("Internet Not connect")
            return
        }
        console.log("db not connect")
    })
}


module.exports = DBConnection