const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  interestedSectors: [
    {
        name: String
    }
  ]
});

const User = mongoose.model("User", UserSchema)
module.exports = User
