const mongoose = require("mongoose");

const companyModel = new mongoose.Schema({
  userId: { type: String, require: true },
  companyName: { type: String, require: true },
  logo: { type: String, require: true },
  banner: { type: String, require: true },
  biography: { type: String, require: true },
});

module.exports = mongoose.model("CompanyData", companyModel);
