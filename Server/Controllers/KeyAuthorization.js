const { User } = require("../Models/User");
const nodemailer = require("nodemailer");
const yup = require("yup");

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.USERMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

// Validation Schema
const Validation = yup.object().shape({
  PassKey: yup.string().required("Passkey is required"),
});

exports.KeyAuthorization = async (req, res) => {
  const { PassKey } = req.body;

  try {
    await Validation.validate({ PassKey }, { abortEarly: false });
    const existingUser = await User.findOne({ PassKey: PassKey });

    if (!existingUser) {
      return res.status(400).json({ error: "Invalid passkey!" });
    }

    if (existingUser.isLocked) {
      if (Date.now() < existingUser.lockUntil) {
        return res.status(403).json({
          error:
            "Account is locked due to multiple failed attempts. Try again later.",
        });
      } else {
        existingUser.isLocked = false;
        existingUser.failedAttempts = 0;
        existingUser.lockUntil = null;
      }
    }

    if (Date.now() > existingUser.passkeyExpiration) {
      existingUser.failedAttempts += 1;
      if (existingUser.failedAttempts >= 3) {
        existingUser.isLocked = true;
        existingUser.lockUntil = Date.now() + 30 * 60 * 1000;

        const lockMailOptions = {
          to: existingUser.Email,
          subject: "Nexus Bank: Account Locked",
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
                  <p>Your account has been locked due to multiple unsuccessful attempts to enter your passkey. Please wait 30 minutes before attempting again or contact our customer support for assistance.</p>
                  <p>Best regards,<br />The Nexus Bank Team</p>
                  <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
                  <p style="text-align: center; font-size: 12px; color: #666;">&copy; 2024 Nexus Bank. All rights reserved.<br>You are receiving this email because you signed up on our platform.</p>
              </td>
          </tr>
      </table>
          `,
        };

        transporter.sendMail(lockMailOptions, (error, info) => {
          if (error) {
            console.log("Error sending lock notification email", error);
          } else {
            console.log("Lock notification email sent: " + info.response);
          }
        });
      }
      await existingUser.save();
      return res
        .status(400)
        .json({ error: "Passkey has expired or is invalid!" });
    }

    // Clear the passkey and expiration, reset failed attempts
    existingUser.PassKey = null;
    existingUser.passkeyExpiration = null;
    existingUser.failedAttempts = 0;
    existingUser.isLocked = false;
    existingUser.lockUntil = null;
    await existingUser.save();

    const mailOptions = {
      to: existingUser.Email,
      subject: "Nexus Bank: Transfer Successful!",
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
                <p>You have suucessfully completed a transfer on your Nexus account.</p>
                <h2 style="display:flex; justify-content: center; align-items: center; font-size: 40px; color: #004080;">Amount: [Amount here]</h2>
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

    // Send the email
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log("Error sending mail", error);
        return res.status(500).json({ error: "Error sending email" });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({
          message: "Notification email sent",
          userId: existingUser._id,
        });
      }
    });
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
};
