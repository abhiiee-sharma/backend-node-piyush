const mongoose = require('mongoose');

//Schema
const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true,
    },
    lastName : {
        type: String,
    },
    email : {
        type: String,
        required: true,
        unique: true,
    },
    jobTitle: {
        type: String,
    },
    gender : {
        type: String,
    }
}, {timestamps: true,} );

//Creating model from the schema
const user = mongoose.model("userDatabase", userSchema);

module.exports = user;