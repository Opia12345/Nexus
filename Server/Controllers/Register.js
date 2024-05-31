const nodemailer = require("nodemailer");
const saltRounds = 15;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../Models/User");
const yup = require("yup");
require("dotenv").config();

//NODEMAILER
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

exports.Register = async (req, res) => {
  const { LastName, FirstName, Email, Password } = req.body;

  try {
    const validationSchema = Validation;
    await validationSchema.validate(
      { LastName, FirstName, Email, Password },
      { abortEarly: false }
    );

    //CHECK FOR EXISTING USERS
    const existingMail = await User.findOne({ Email });

    if (existingMail) {
      return res
        .status(409)
        .json({ error: "User with this Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    const newUser = new User({
      LastName,
      FirstName,
      Email,
      Password: hashedPassword,
    });

    const userId = newUser._id;

    const refreshToken = jwt.sign({ userId }, process.env.JWTSECRET, {
      expiresIn: "3m",
    });

    newUser.resetToken = refreshToken;
    newUser.resetTokenExpiration = Date.now() + 3 * 60 * 1000;

    await newUser.save();

    const verificationLink = `${process.env.BASE_URL}/emailConfirmed?token=${refreshToken}`;

    const response = { message: "User created successfully", userId };

    res.status(201).json(response);

    let mailOptions = {
      from: process.env.USERMAIL,
      to: Email,
      subject:
        "Welcome to The Vault - Secure Your Account with Password Storage",
      html: `<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 400px; background: white; color: black;">
      <tr>
          <td align="center">
              <img src="cid:logo" alt="Logo" style="width: 100%; display: block;">
          </td>
      </tr>
      <tr>
          <td style="padding: 40px;">
                <h3 style="margin-top: 0;">Dear ${FirstName},</h3>
              <p>Welcome to The Vault! We are thrilled to have you join our community. At The Vault, your security is our top priority. To ensure that your account remains secure, we offer a robust password storage feature designed to protect your credentials.</p>
              <p>Before you can start using all the features, please verify your email address by clicking the link below:</p>
              <p style="text-align: center;">
                  <a href="${verificationLink}" style="background: #F44708; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Your Email</a>
              <p>We recommend using this feature to manage all your passwords in one secure place, ensuring that your accounts remain protected.</p>
              <p>If you have any questions or need assistance, our support team is here to help. Feel free to reach out to us at support@thevault.com or visit our.</p>

              <p>Thank you for choosing The Vault. We look forward to providing you with a seamless and secure experience.</p>

              <p>Best regards,<br />
                 CEO,<br />
              Anthony Pascal. <br /></p>
              <hr>
              <p style="text-align: center; font-size: 12px; color: #444;"> © 2024, All rights reserved.<br>You are receiving this email because you signed up on our platform</p>
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
        .json({ error: "An error occured, please try again later" });
    }
  }
};
