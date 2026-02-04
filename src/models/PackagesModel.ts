import mongoose from "mongoose";

const PackagesSchema = new mongoose.Schema({
    companyId:{type: String, required:true},
    packageId: {type: String, required: true},
    packageName: {type: String, required: true},
    price: {type: Number, required: true},
    billingCycle: {type: String, required: true},
    features: {type: [String], required: true}, // Updated to an array of strings
    description: {type: String, required: true},
},{
timestamps: true,
});

export default mongoose.model('Packages', PackagesSchema);
