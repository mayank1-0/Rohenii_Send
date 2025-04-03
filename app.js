
const DBConnection = require("./database/DBConnection");
const app= require("./index")
require("dotenv").config();

DBConnection()


app.listen(process.env.PORT || 3000, console.log(`App is running`))