const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//USER SCHEMA
const userSchema = new Schema(
  {
    LastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    FirstName: {
      type: String,
      required: [true, "First name is required"],
    },
    Email: {
      type: String,
      required: [true, "Email Address is required"],
      unique: true,
    },
    Password: {
      type: String,
      required: [true, "Password is required"],
    },
    otp: {
      type: Number,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("UserRegister", userSchema);

module.exports = { User };
