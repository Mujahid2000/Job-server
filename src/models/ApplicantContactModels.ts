import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  primaryEmail: { 
    type: String, 
    required: true 
},
  secondaryEmail: { 
    type: String 
},
  primaryPhone: { 
    type: String, 
    required: true 
},
  secondaryPhone: { 
    type: String 
},
  socialLinks: {
    linkedin: { type: String },
    github: { type: String },
    twitter: { type: String },
  },
});

const ContactData =  mongoose.model("Contact", ContactSchema);

export default ContactData;
