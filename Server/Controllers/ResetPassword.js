const nodemailer = require("nodemailer");
const { User } = require("../Models/User");
const yup = require("yup");

// NODEMAILER
const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.USERMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

const Validation = yup.object().shape({
  Email: yup
    .string()
    .email("Please use a valid email address")
    .required("Email is required"),
});

exports.PasswordReset = async (req, res) => {
  const { Email } = req.body;

  try {
    await Validation.validate({ Email }, { abortEarly: false });
    const existingUser = await User.findOne({ Email });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    existingUser.otp = otp;
    existingUser.otpExpiration = Date.now() + 3 * 60 * 1000;

    await existingUser.save();

    const mailOptions = {
      to: Email,
      subject: "Password Reset Request",
      html: `
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
      <tr>
          <td align="center" bgcolor="#000000">
              <img src="cid:logo" alt="Logo" style="width: 100%; display: block;">
          </td>
      </tr>
      <tr>
          <td style="padding: 40px;">
              <h3 style="margin-top: 0;">Hello ${existingUser.userName} 👋,</h3>
              <p>We received a request to reset your password. Please use the following OTP to reset your password. This OTP is valid for 3 minutes:</p>
              <h2 style="display: flex; align-items: center; justify-content: center; font-size: 44px;">${otp}</h2>
              <p>If you did not request a password reset, you can safely ignore this email.</p>
              
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

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending mail ", error);
        return res.status(500).json({ error: "Error sending email" });
      } else {
        console.log("Email sent: " + info.response);
        setTimeout(async () => {
          existingUser.otp = null;
          existingUser.otpExpiration = null;
          await existingUser.save();
        }, 3 * 60 * 1000);
        res.status(200).json({
          message: "Password reset email sent",
          userId: existingUser._id,
        });
      }
    });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};
