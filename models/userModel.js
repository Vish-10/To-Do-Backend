const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    userName: {
        type: String
    },
    name: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String
    }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userModel);