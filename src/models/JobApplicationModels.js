const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobPostingSchema = new Schema(
    {
    userId: {
        type: String,
        required: true,
        trim: true
    },
    companyId: {
        type: String,
        required: true,
        trim: true,
        index: true // For better query performance
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    tags: {
        type: [String], // Array of strings
        default: []
    },
    jobRole: {
        type: String,
        required: true,
        trim: true
    },
    salaryType: {
        type: String,
        required: true,
        trim: true
    },
    minSalary: {
        type: Number,
        required: true,
        min: 0 // Minimum value 0 or greater
    },
    maxSalary: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: function(value) {
                return value >= this.minSalary; // maxSalary must be >= minSalary
            },
            message: 'maxSalary must be greater than or equal to minSalary'
        }
    },
    education: {
        type: String,
        required: true,
        trim: true
    },
    experience: {
        type: String,
        required: true,
        trim: true
    },
    jobType: {
        type: String,
        required: true,
        trim: true
    },
    expiryDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value > new Date(); // Ensure expireDate is in the future
            },
            message: 'expireDate must be a future date'
        }
    },
    vacancies: {
        type: String,
        required: true,
    },
    jobLevel: {
        type: String,
        required: true,
        trim: true
    },
    biography: {
        type: String,
        required: true,
        trim: true
    },
    responsibilities: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
    },
    postedDate: {
        type: Date,
        default: Date.now // Default to the current date
    },
    status: {
        type: String,
        required: true,
        trim: true,
        default: 'open'
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    
});

const JobPosting = mongoose.model('JobPostingCollection', JobPostingSchema);

module.exports = JobPosting;