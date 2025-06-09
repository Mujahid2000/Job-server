const mongoose = require('mongoose');

const CustomerProfileSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

const CustomerProfile = mongoose.model('CustomerProfile', CustomerProfileSchema);

module.exports = CustomerProfile;