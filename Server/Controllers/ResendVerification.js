const jwt = require("jsonwebtoken");
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

exports.resendVerification = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId });

    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWTSECRET, {
      expiresIn: "3m",
    });

    user.resetToken = refreshToken;
    user.resetTokenExpiration = Date.now() + 3 * 60 * 1000;
    await user.save();

    const verificationLink = `${process.env.BASE_URL}/emailConfirmed?token=${refreshToken}`;

    let mailOptions = {
      from: process.env.USERMAIL,
      to: user.Email,
      subject: "Welcome to Nexus Bank! Your Account Registration is Complete",
      html: `<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background: white; color: #333; font-family: Arial, sans-serif; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <tr>
          <td align="center" style="background-color: #004080; padding: 20px 0;">
              <img src="cid:logo" alt="Nexus Bank Logo" style="width: 150px; display: block;">
          </td>
      </tr>
      <tr>
          <td style="padding: 40px;">
              <h3 style="color: #004080; margin-top: 0;">Dear ${user.FirstName},</h3>
              <p>Welcome to Nexus Bank! We are thrilled to have you on board and look forward to providing you with a seamless and secure banking experience. Your account has been successfully registered, and you are now ready to take advantage of all the features and benefits Nexus Bank has to offer.</p>
              <p>Here are your account details:</p>
              <ul style="list-style-type: none; padding: 0;">
                  <li><strong>Account Number:</strong> ${user.accountNumber}</li>
                  <li><strong>User ID:</strong> ${user.userID}</li>
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
        return res
          .status(500)
          .json({ error: "Error sending verification email" });
      } else {
        console.log("Email sent: " + info.response);
        return res
          .status(200)
          .json({ message: "Verification email sent successfully" });
      }
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "An error occurred, please try again later" });
  }
};
