const mongoose = require('mongoose');

const taskModel = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    taskName: {
        type: String
    },
    taskStatus: {
        type: String
    }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Task', taskModel);