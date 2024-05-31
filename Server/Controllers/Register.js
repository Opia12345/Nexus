const nodemailer = require("nodemailer");
const saltRounds = 15;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../Models/User");
const yup = require("yup");
require("dotenv").config();

// NODEMAILER
const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.USERMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

const Validation = yup.object().shape({
  LastName: yup.string().required("Last Name is required"),
  FirstName: yup.string().required("First Name is required"),
  Email: yup
    .string()
    .email("Please use a valid email address")
    .required("Email is required"),
  Password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

function generateUserId() {
  let userID = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 10; i++) {
    userID += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return userID;
}

function generateAccountNumber() {
  let accountNumber = "";
  const digits = "0123456789";
  for (let i = 0; i < 10; i++) {
    accountNumber += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return accountNumber;
}

exports.Register = async (req, res) => {
  const { LastName, FirstName, Email, Password } = req.body;

  try {
    const validationSchema = Validation;
    await validationSchema.validate(
      { LastName, FirstName, Email, Password },
      { abortEarly: false }
    );

    // CHECK FOR EXISTING USERS
    const existingMail = await User.findOne({ Email });

    if (existingMail) {
      return res
        .status(409)
        .json({ error: "User with this Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(Password, saltRounds);
    const userID = generateUserId();
    const newAccountNumber = generateAccountNumber();

    const newUser = new User({
      LastName,
      FirstName,
      Email,
      Password: hashedPassword,
      userID: userID,
      accountNumber: newAccountNumber,
    });

    const refreshToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWTSECRET,
      {
        expiresIn: "3m",
      }
    );

    newUser.resetToken = refreshToken;
    newUser.resetTokenExpiration = Date.now() + 3 * 60 * 1000;

    await newUser.save();

    const verificationLink = `${process.env.BASE_URL}/emailConfirmed?token=${refreshToken}`;

    const response = {
      message: "User created successfully",
      newAccountNumber,
    };

    res.status(201).json(response);

    let mailOptions = {
      from: process.env.USERMAIL,
      to: Email,
      subject: "Welcome to Nexus Bank! Your Account Registration is Complete",
      html: `<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background: white; color: #333; font-family: Arial, sans-serif; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <tr>
          <td align="center" style="background-color: #004080; padding: 20px 0;">
              <img src="cid:logo" alt="Nexus Bank Logo" style="width: 150px; display: block;">
          </td>
      </tr>
      <tr>
          <td style="padding: 40px;">
              <h3 style="color: #004080; margin-top: 0;">Dear ${FirstName},</h3>
              <p>Welcome to Nexus Bank! We are thrilled to have you on board and look forward to providing you with a seamless and secure banking experience. Your account has been successfully registered, and you are now ready to take advantage of all the features and benefits Nexus Bank has to offer.</p>
              <p>Here are your account details:</p>
              <ul style="list-style-type: none; padding: 0;">
                  <li><strong>Account Number:</strong> ${newAccountNumber}</li>
                  <li><strong>User ID:</strong> ${userID}</li>
              </ul>
              <p>You can log in to your account using the following link:</p>
              <p style="text-align: center;">
                  <a href="${verificationLink}" style="background: #0073e6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Log In to Your Account</a>
              </p>
              <p>Get Started with Nexus Bank:</p>
              <ol>
                  <li><strong>Login to Your Account:</strong> Use your User ID and the password you set during registration to log in.</li>
                  <li><strong>Explore Features:</strong> Discover our range of banking services, including online transfers, bill payments, and more.</li>
                  <li><strong>Stay Secure:</strong> Enable two-factor authentication for added security and regularly update your password.</li>
              </ol>
              <p>Please note that your User ID cannot be reset. Make sure to keep it confidential and safe.</p>
              <p>If you have any questions or need assistance, our customer support team is here to help. You can reach us at chinyereozoemelam2@gmail.com or call us at +234 817 079 5643.</p>
              <p>Thank you for choosing Nexus Bank. We look forward to serving you!</p>
              <p>Best regards,<br />
                 The Nexus Bank Team</p>
              <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
              <p style="text-align: center; font-size: 12px; color: #666;">&copy; 2024 Nexus Bank. All rights reserved.<br>You are receiving this email because you signed up on our platform.</p>
          </td>
      </tr>
  </table>
         `,
      attachments: [
        {
          filename: "logo.png",
          path: "./logo.png",
          cid: "logo",
        },
      ],
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error sending mail ", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "Validation error", details: err.errors });
    } else {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred, please try again later" });
    }
  }
};
