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
                  <h3 style="margin-top: 0;">Dear ${user.userName},</h3>
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
