const {model, Schema} = require("mongoose");

const userSchema = new Schema({
    name: {
        type: "String",
        required: true
    },

    email: {
        type: "String",
        required: true
    },

    username: {
        type: "String",
        required: true,
    },

    phone: {
        type: "String",
        required: true
    },

    profession: {
        type: "String",
        required: true
    },

    age: {
        type: "Number",
        required: true
    },

    password: {
        type: "String",
        required: true
    },

    confirmpassword: {
        type: "String",
        required: true
    }
},
{
    timestamps: true
});

module.exports = model('user', userSchema);