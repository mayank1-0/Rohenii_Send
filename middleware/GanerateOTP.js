const GanerateOTP=(length)=>{
        const otp = Math.floor(100000 + Math.random() * 900000);
        return otp;
}


module.exports = GanerateOTP

