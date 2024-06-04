const nodemailer = require("nodemailer");
const { User } = require("../Models/User");

// NODEMAILER
const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.USERMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

exports.ResendOTP = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId });

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    user.otp = otp;
    user.otpExpiration = Date.now() + 3 * 60 * 1000;

    await user.save();

    const mailOptions = {
      to: user.Email,
      subject: "Nexus Bank: Password Reset Request",
      html: `
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background: white; color: #333; font-family: Arial, sans-serif; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <tr>
          <td align="center" style="background-color: white; padding: 20px 0;">
              <img src="cid:logo" alt="Nexus Bank Logo" style="width: 150px; display: block;">
          </td>
      </tr>
      <tr>
          <td style="padding: 40px;">
              <h3 style="color: #004080; margin-top: 0;">Dear ${user.FirstName},</h3>
              <p>We have recieved your request to reset your password. Use the OTP below to do so as it expires in three minuts:</p>
              <h2 style="display:flex; justify-content: center; align-items: center; font-size: 40px; color: #004080;">${otp}</h2>

              <p>If you did not request this change, please ignore this email.</p>
              <p>For your security, please ensure that your account information remains confidential and regularly update your password.</p>
              <p>Thank you for being a valued member of Nexus Bank.</p>
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

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending mail ", error);
        return res.status(500).json({ error: "Error sending email" });
      } else {
        console.log("Email sent: " + info.response);
        setTimeout(async () => {
          user.otp = null;
          user.otpExpiration = null;
          await user.save();
        }, 3 * 60 * 1000);
        res.status(200).json({ message: "Password reset email sent" });
      }
    });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};
