
const DBConnection = require("./database/DBConnection");
const app= require("./index")
require("dotenv").config();

DBConnection()


app.listen(process.env.PORT || 3000,()=> console.log(`server running on Port ${process.env.PORT} or 3000`))