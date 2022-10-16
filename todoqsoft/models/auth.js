const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique : true,
    required: true
  },
  password: {
    type: String,
    minlength :6,
    required: true,
  },
  role: {
    type: String,
    default: "User",
    required: true,
  }
})

module.exports = mongoose.model("User",userSchema)