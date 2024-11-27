
const DBConnection = require("./database/DBConnection");
const app= require("./index")
require("dotenv").config();

DBConnection()


app.listen(process.env.PORT,()=> console.log(`server running on Port ${process.env.PORT}`))