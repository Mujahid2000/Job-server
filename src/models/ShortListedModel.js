const mongoose = require('mongoose');

function formatDate(date) {
    const day = date.getDate();
    const suffix = (d) => {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
            case 1:  return 'st';
            case 2:  return 'nd';
            case 3:  return 'rd';
            default: return 'th';
        }
    };
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return `${day}${suffix(day)} ${months[date.getMonth()]}, ${date.getFullYear()}`;
}

const shortListedModel = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    jobId: {
        type: String,
        required: true
    },
    resumeId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    applicantId: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: () => formatDate(new Date())
    }
})

const shortListedSchema = new mongoose.model('shortlist', shortListedModel);


module.exports = shortListedSchema