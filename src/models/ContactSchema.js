const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'User',
    },
    mapLocation: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
}, {
    timestamps: true,
});

const LastContact = mongoose.model('Contact', ContactSchema);

module.exports = LastContact;