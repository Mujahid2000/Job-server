const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  contactId: { type: String, required: true }, 
  userId: { type: String, required: true }, 
  street: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  mapLocation: { type: String, required: true }
});

module.exports = mongoose.model('Address', AddressSchema);