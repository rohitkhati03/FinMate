//import rate limit
import rateLimit from "express-rate-limit";

//register rate limit 3 attempts per hour
export const registerLimit = rateLimit({
    windowMs:60*60*1000,
    max:6,
    message:{
        sucess: false,
        message:"Too many request. Please try again after some time",
    },
    standardHeaders:true,
    legacyHeaders:false,
});

//login rate limit 3 attempts per 15 mintues
export const loginLimit = rateLimit({
    windowMs:15*60*1000,
    max:5,
    message:{
        sucess:false,
        message:"Too many attempts. Please try after 15 mintues ",
    },
    standardHeaders:true,
    legacyHeaders:false,
});

//otp rate limit 3 attempts per hrs
export const optlimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hours
  max: 3,
  message: {
    success: false,
    message: "Too many otp request. Please try again after an hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
// forgot password rate limit 3 attempts per hrs
export const forgotPasswordLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    message: "Too many password request. Please try agian after an hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
