import mongoose from "mongoose";

// Helper to format date as "24th April, 2025"
function formatDate(date: Date) {
    const day = date.getDate();
    const suffix = (d: number) => {
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

const jobApplySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    jobId: {
        type: String,
        required: true
    },
    resume_Id: {
        type: String,
        required: true
    },
    coverLetter: {
        type:String,
        required: true
    },
    date: {
        type: String,
        default: () => formatDate(new Date())
    }
},
{
    timestamps: true 
});

const JobAppliedSchema = mongoose.model('jobApplyData', jobApplySchema);

export default JobAppliedSchema;
