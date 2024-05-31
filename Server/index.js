const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const Register = require("./Controllers/Register");
const updateEmail = require("./Controllers/UpdateEmail");
const updatePassword = require("./Controllers/UpdatePassword");
const signIn = require("./Controllers/SignIn");
const PasswordReset = require("./Controllers/ResetPassword");
const resendVerification = require("./Controllers/ResendVerification");
const ResendOTP = require("./Controllers/ResendOTP");
const OTPConfirmation = require("./Controllers/OTPConfirmation");
const logout = require("./Controllers/Logout");
const PassKey = require("./Controllers/PassKey");
const Delete = require("./Controllers/Delete");
const KeyAuthorization = require("./Controllers/KeyAuthorization");
require("dotenv").config();

// CONFIGURATIONS
const app = express();
const port = process.env.port || 8080;
const publicPath = path.join(__dirname, "Views");

app.use(express.static(publicPath));
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dbURI = process.env.dbURI;

// ROUTES
app.post("/register", Register.Register);
app.post("/signin", signIn.signIn);
app.post("/logout", logout.logout);
app.delete(`/users/delete/:userId`, Delete.Delete);
app.patch(`/email-update/:userId`, updateEmail.updateEmail);
app.patch(`/password-update/:userId`, updatePassword.updatePassword);
app.post("/passwordReset", PasswordReset.PasswordReset);
app.post("/resend-verification/:userId", resendVerification.resendVerification);
app.post("/pass-key/:userId", PassKey.PassKey);
app.post("/authorize", KeyAuthorization.KeyAuthorization);
app.post("/resend-OTP/:userId", ResendOTP.ResendOTP);
app.post("/OTPConfirmation", OTPConfirmation.OTPConfirmation);

// WILDCARD ROUTE
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// DATABASE CONNECTION AND SERVER START
mongoose
  .connect(dbURI)
  .then(() => {
    console.log(`Loading...`);
    app.listen(port, () => {
      console.log(`Server running on ${port} and MongoDB connected`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
