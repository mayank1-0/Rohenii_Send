const ErrorHandler = require("./ErrorHandler")

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server Error"

    if(err.name==="ValidationError"){
        const message =Object.values(err.errors)[0].message
        err.message = message
    }
    
  // Mongoose duplicate key error
  // ==================================  Wrong Mongodb Id error ===============================
  if (err.code === 11000) {
    const message = `${Object.keys(err.keyValue)} Must be Unique`;
    err = new ErrorHandler(message, 400);
  }
  // ==================================  Wrong Mongodb Id error ===============================



  // ==================================  JsonWebTokenError error ===============================
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again `;
    err = new ErrorHandler(message, 401);
  }

  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again `;
    err = new ErrorHandler(message, 401);
  }



  // ==================================  JsonWebTokenError error ===============================
  

  // ==================================  Wrong Mongodb Id error ===============================
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path==="_id"?"id":err.path}`;
    err = new ErrorHandler(message, 400);
}

  // ==================================  Wrong Mongodb Id error ===============================
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
}