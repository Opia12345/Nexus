const nodemailer = require("nodemailer");
const { User } = require("../Models/User");
const crypto = require("crypto");

// NODEMAILER
const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.USERMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

// FUNCTION TO GENERATE A SECURE COMPLEX PASSKEY
const generatePasskey = (length) => {
  return crypto.randomBytes(length).toString("hex");
};

exports.PassKey = async (req, res) => {
  const { userId } = req.params;

  try {
    const existingUser = await User.findOne({ _id: userId });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const passkey = generatePasskey(4);

    existingUser.PassKey = passkey;
    existingUser.passkeyExpiration = Date.now() + 2 * 60 * 1000;

    await existingUser.save();

    const mailOptions = {
      to: existingUser.Email,
      subject: "Nexus Bank: Transfer Authorization",
      html: `
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background: white; color: #333; font-family: Arial, sans-serif; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <tr>
          <td align="center" style="background-color: #004080; padding: 20px 0;">
              <img src="cid:logo" alt="Nexus Bank Logo" style="width: 150px; display: block;">
          </td>
      </tr>
      <tr>
          <td style="padding: 40px;">
              <h3 style="color: #004080; margin-top: 0;">Dear ${existingUser.FirstName},</h3>
              <p>We have received a transfer request for your Nexus account associated with this email. Here is your passkey:</p>
              <h2 style="display:flex; justify-content: center; align-items: center; font-size: 40px; color: #004080;">${passkey}</h2>
              <p>If you do not authorize this transfer, please contact our customer support team immediately at chinyereozoemelam2@gmail.com or call us at +234 817 079 5643.</p>
              <p>For your security, please ensure that your account information remains confidential and regularly update your password.</p>
              <p>Thank you for being a valued member of Nexus Bank.</p>
              <p>Best regards,<br />The Nexus Bank Team</p>
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

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log("Error sending mail", error);
        return res.status(500).json({ error: "Error sending email" });
      } else {
        console.log("Email sent: " + info.response);
        setTimeout(async () => {
          existingUser.PassKey = null;
          existingUser.passkeyExpiration = null;
          await existingUser.save();
        }, 3 * 60 * 1000); // Clear passkey after 3 minutes
        res.status(200).json({
          message: "Authorization email sent",
          userId: existingUser._id,
        });
      }
    });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};
