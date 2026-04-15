import { body, validationResult } from "express-validator";

export const checkErrors = (req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            message: "validation error",
            errors: errors.array().map((err)=>({
                field:err.path,
                message:err.msg,
            })),
        });
    }
    next();
}

//Registration validation
export const validateRegister=[
    body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({min:2, max:30})
    .withMessage("Your name should be between 2 to 30 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Nmae can only contian letters"),

    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizEmail(),

    body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({min:8})
    .withMessage("Passwor should be atleast 8 charactere")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number ")
    .matches(/[!@#$%^&*]/)
    .withMessage(" Password must contian atleast one special character (!@#$%^&*)")

    .body("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .matches(/[0-9]/)
    .withMessage("Phone number must contain only number"),

    //error check
    checkErrors,
]

//login validator
export const validateLogin = [
    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email  is requied")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizEmail(),

    body("password")
    .notEmpty()
    .withMessage("Password is required"),

    //check error 
    checkErrors,
]


//opt vaidation
export const vaidateOTP = [
  body("otp")
    .notEmpty()
    .withMessage("otp is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits")
    .isNumeric()
    .withMessage("OTP must contain only number"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  checkErrors,
];
