const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { setTheUsername } = require("whatwg-url");

module.exports.updateName = async (req, res) => {
    const { name, id } = req.body;
    if (name === '') {
        return res.status(400).json({ errors: [{ msg: "Please fill the new name" }] })
    }
    else {
        try {
            const user = await User.findOneAndUpdate({ _id: id }, { name: name }, { new: true });
            const token = jwt.sign({ user }, process.env.SECRET, {
                expiresIn: '7d',
            });
            return res.status(200).json({ token, msg: "Name Updated successfully" });
        } catch (error) {
            return res.status(500).json({ errors });
        }
    }
}
module.exports.updatePasswordValidations = [
    body("currentPassword").not().isEmpty().trim().withMessage("Please fill your Current Password"),
    body("newPassword").isLength({ min: 8 }).withMessage("New Password must be 8 characters long")
]
module.exports.updatePassword = async (req, res) => {
    const { currentPassword, newPassword, userId } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    else {
        const user = await User.findOne({ _id: userId });
        if (user) {
            const matched = await bcrypt.compare(currentPassword, user.password);
            if (!matched) {
                return res.status(400).json({ errors: [{ msg: "Please enter correct current password" }] })
            }
            else {
                try {
                    const salt = await bcrypt.genSalt(10);
                    const hash = await bcrypt.hash(newPassword, salt);
                    const newUserPassword = await User.findOneAndUpdate({ _id: userId }, { password: hash }, { new: true });
                    return res.status(200).json({ token, msg: "Password Updated successfully" })
                }
                catch (error) {
                    return res.status(500).json({ errors });
                }
            }
        }
    }

}
module.exports.updateAboutValidation = [
    body("name").not().isEmpty().trim().withMessage("Please fill the name"),
    body("email").not().isEmpty().trim().withMessage("Please fill the Email"),
    body("username").not().isEmpty().trim().withMessage("Please fill the Username"),
    body("profession").not().isEmpty().trim().withMessage("Please fill the Profession"),
    body("phone").isLength({ min: 10 }).withMessage("Length of number must be 10"),
    body("age").isNumeric().withMessage("Age must be a number").custom((age) => {
        if (age <= 0) {
            throw new Error("Age must be positive")
        }
        else {
            return true;
        }
    })
]
module.exports.updateAbout = async (req, res) => {
    console.log(req.body);
    const { id, name, email, username, profession, phone, age } = req.body;
    const errors = validationResult(req);
    console.log(errors.array());

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    else {
        try {
            // const user = await User.find({ _id: id });
            // user.name = newName
            // user.email = newEmail
            // user.username = newUsername
            // user.phone = newPhone
            // user.profession = newProfession
            // user.age = newAge
            // user.new = true
            // user.save(function(err){

            // })

            //      { name: newName },
            //     //  { email: newEmail }, 
            //     //  { username: newUsername },
            //     //  { phone: newPhone },
            //     //  { profession: newProfession },
            //     //  { age: newAge },
            //      { new: true }, 
            //      );
           
                const updatedUserInfo = await User.findByIdAndUpdate(id, {
                    name,
                    email,
                    username,
                    phone,
                    profession,
                    age,
                    new: true
                });
                // const token = jwt.sign({ updatedUserInfo }, process.env.SECRET, {
                //     expiresIn: '7d',
                // });
                return res.status(200).json({ msg: "Details Updated Successfully" })
            } catch (error) {
                console.log(error);
                return res.status(500).json({ errors: error, msg: error.message });
            }

        //     const user = await User.findOneAndUpdate({ "_id": id }, { "$set": { "name": newName, "username": newUsername, "phone": newPhone, "profession": newProfession, "age": newAge } }, { new: true }).exec(function (err, book) {
        //         if (err) {
        //             console.log(err);
        //             res.status(500).send(err);
        //         } else {
        //             res.status(200).send(book);
        //         }
        //     });
        //     const token = jwt.sign({ user }, process.env.SECRET, {
        //         expiresIn: '7d',
        //     });
        //     return res.status(200).json({ token, msg: "Details Updated successfully" });
        // } catch (error) {
        //     console.log(error);
        //     return res.status(500).json({ errors });
        // }
    }
}

module.exports.updateEmail = async (req, res) => {
    const { email, id } = req.body;
    // const errors = updateAboutValidation(req);
    // console.log(errors.array());

    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() })
    // }
    if (email === '') {
        return res.status(400).json({ errors: [{ msg: "Please fill the new email" }] })
    }
    else {
        try {
            const user = await User.findOneAndUpdate({ _id: id }, { email: email }, { new: true });
            const token = jwt.sign({ user }, process.env.SECRET, {
                expiresIn: '7d',
            });
            return res.status(200).json({ token, msg: "Email Updated successfully" });
        } catch (error) {
            return res.status(500).json({ errors });
        }
    }
}

module.exports.updateUsername = async (req, res) => {
    const { username, id } = req.body;
    // const errors = updateAboutValidation(req);
    // console.log(errors.array());

    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() })
    // }
    if (username === '') {
        return res.status(400).json({ errors: [{ msg: "Please fill the new username" }] })
    }
    else {
        try {
            const user = await User.findOneAndUpdate({ _id: id }, { username: username }, { new: true });
            const token = jwt.sign({ user }, process.env.SECRET, {
                expiresIn: '7d',
            });
            return res.status(200).json({ token, msg: "Username Updated successfully" });
        } catch (error) {
            return res.status(500).json({ errors });
        }
    }
}

module.exports.updateProfession = async (req, res) => {
    const { profession, id } = req.body;
    // const errors = updateAboutValidation(req);
    // console.log(errors.array());

    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() })
    // }
    if (profession === '') {
        return res.status(400).json({ errors: [{ msg: "Please fill the new profession" }] })
    }
    else {
        try {
            const user = await User.findOneAndUpdate({ _id: id }, { profession: profession }, { new: true });
            const token = jwt.sign({ user }, process.env.SECRET, {
                expiresIn: '7d',
            });
            return res.status(200).json({ token, msg: "Profession Updated successfully" });
        } catch (error) {
            return res.status(500).json({ errors });
        }
    }
}

// module.exports.updatePhoneValidation = [
//     body("phone").isLength({ min: 10 }).withMessage("Length of number must be 10"),
// ]

module.exports.updatePhone = async (req, res) => {
    const { phone, id } = req.body;
    // const errors = updatePhoneValidation(req);
    // console.log(errors.array());

    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() })
    // }
    if (phone === '') {
        return res.status(400).json({ errors: [{ msg: "Please fill the new contact number" }] })
    }
    else {
        try {
            const user = await User.findOneAndUpdate({ _id: id }, { phone: phone }, { new: true });
            const token = jwt.sign({ user }, process.env.SECRET, {
                expiresIn: '7d',
            });
            return res.status(200).json({ token, msg: "Contact Number Updated successfully" });
        } catch (error) {
            return res.status(500).json({ errors });
        }
    }
}

module.exports.updateAge = async (req, res) => {
    const { age, id } = req.body;
    // const errors = updatePhoneValidation(req);
    // console.log(errors.array());

    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() })
    // }
    if (age === '') {
        return res.status(400).json({ errors: [{ msg: "Please fill the new age" }] })
    }
    else {
        try {
            const user = await User.findOneAndUpdate({ _id: id }, { age: age }, { new: true });
            const token = jwt.sign({ user }, process.env.SECRET, {
                expiresIn: '7d',
            });
            return res.status(200).json({ token, msg: "Age Updated successfully" });
        } catch (error) {
            return res.status(500).json({ errors });
        }
    }
}