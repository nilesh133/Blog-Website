const {body, validationResult} = require("express-validator");
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config()

const generateToken = (user) => {
    return jwt.sign({user}, process.env.SECRET, {
        expiresIn: '7d',
    });
};

module.exports.registerValidation = [
    body("name").not().isEmpty().trim().withMessage("Please fill the name"),
    body("email").not().isEmpty().trim().withMessage("Please fill the Email").isEmail().withMessage("Email is not valid"),
    body("username").not().isEmpty().trim().withMessage("Please fill the Username"),
    body("phone").isLength({min: 10}).withMessage("Length of number must be 10"),
    body("profession").not().isEmpty().trim().withMessage("Please fill the Profession"),
    body("age").isNumeric().withMessage("Age must be a number").custom((age) => {
        if(age <= 0){
            throw new Error("Age must be positive")
        }
        else{
            return true;
        }
    }),
    body("password").isLength({min: 8}).withMessage("Password must be 8 characters long"),
    body("confirmpassword").isLength({min: 8}).withMessage("Confirm Password must be 8 characters long")
]

//  Registration
module.exports.register = async (req, res) =>{
    const {name, email, username, phone, profession, age, password, confirmpassword} = req.body;
    const errors = validationResult(req);
    console.log(errors.array());

    if(password != confirmpassword){
        return res.status(401).json({errors: [{msg: "Password and Confirm Password must be equal"}]});
    }

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    try{
        const checkUser = await User.findOne({email});
        if(checkUser){
            return res.status(400).json({errors: [{msg: 'Email already exists'}]});
        }

        // Password Hashing
        const salt = await bcrypt.genSalt(10);
        // console.log(salt);
        const hash = await bcrypt.hash(password, salt);
        // console.log(hash);

        try{
            const user = await User.create({
                // One method
                // name: name,
                // email: email,
                // password: hash

                // Second method
                name,
                email,
                username,
                phone,
                profession,
                age,
                password: hash,
                confirmpassword: hash,
            });

            // JWT token
            const token = generateToken(user);

            return res.status(200).json({msg: 'Your account has been created', token})
        }catch(err){
            return res.status(500).json({errors: err});
        }
    }
    catch(err){
        return res.status(500).json({errors: err});
    }
};

// Login
module.exports.loginValidation = [
    body("email").not().isEmpty().trim().withMessage("Please fill the Email"),
    body("password").not().isEmpty().withMessage("Please fill the Password")
]
module.exports.login = async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const{email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(user){
            const matchPassword = await bcrypt.compare(password, user.password);
            if(matchPassword){
                const token = generateToken(user);
                return res.status(200).json({msg: 'Login Successful', token})
            }
            else{
                return res.status(401).json({errors: [{msg: "Password is not correct"}]});
            }
        }
        else{
            return res.status(400).json({errors: [{msg: 'Email not found'}]})
        }

    }catch(err){
        return res.status(500).json({errors: err});
    }
};