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
  Password: yup.string().required("Password is required"),
});

exports.KeyAuthorization = async (req, res) => {
  const { PassKey, Password, transferDetails } = req.body;
  const { userId } = req.params;

  try {
    await Validation.validate({ PassKey, Password }, { abortEarly: false });
    const existingUser = await User.findOne({ userId });

    if (PassKey !== existingUser.PassKey) {
      existingUser.failedAttempts += 1;

      if (existingUser.failedAttempts >= 3) {
        existingUser.isLocked = true;
        existingUser.lockUntil = Date.now() + 24 * 60 * 60 * 1000; // Lock for 24 hours

        const lockMailOptions = {
          to: existingUser.Email,
          subject: "Nexus Bank: Account Locked",
          html: `
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background: white; color: #333; font-family: Arial, sans-serif; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <tr>
              <td align="center" style="background-color: white; padding: 20px 0;">
                  <img src="cid:logo" alt="Nexus Bank Logo" style="width: 150px; display: block;">
              </td>
          </tr>
          <tr>
              <td style="padding: 40px;">
                  <h3 style="color: #004080; margin-top: 0;">Dear ${existingUser.FirstName},</h3>
                  <p>Your account has been locked due to multiple unsuccessful attempts to enter your passkey. This could mean that your account might be compromised, contact customer care now to take necessary steps otherwise, Please wait 24 hours before attempting again or contact our customer support for assistance.</p>
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

        transporter.sendMail(lockMailOptions, (error, info) => {
          if (error) {
            console.log("Error sending lock notification email", error);
          } else {
            console.log("Lock notification email sent: " + info.response);
          }
        });
      }

      await existingUser.save();
    }

    if (existingUser.isLocked) {
      if (Date.now() < existingUser.lockUntil) {
        return res.status(403).json({
          error:
            "Account is locked due to multiple failed attempts. Try again in 24 hours.",
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
        existingUser.lockUntil = Date.now() + 24 * 60 * 60 * 1000; // Lock for 24 hours

        const lockMailOptions = {
          to: existingUser.Email,
          subject: "Nexus Bank: Account Locked",
          html: `
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background: white; color: #333; font-family: Arial, sans-serif; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <tr>
              <td align="center" style="background-color: white; padding: 20px 0;">
                  <img src="cid:logo" alt="Nexus Bank Logo" style="width: 150px; display: block;">
              </td>
          </tr>
          <tr>
              <td style="padding: 40px;">
                  <h3 style="color: #004080; margin-top: 0;">Dear ${existingUser.FirstName},</h3>
                  <p>Your account has been locked due to multiple unsuccessful attempts to enter your passkey. This could mean that your account might be compromised, contact customer care now to take necessary steps otherwise, Please wait 24 hours before attempting again or contact our customer support for assistance.</p>
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
            <td align="center" style="background-color: white; padding: 20px 0;">
              <img src="cid:logo" alt="Nexus Bank Logo" style="width: 150px; display: block;">
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h3 style="color: #004080; margin-top: 0;">Dear ${existingUser.FirstName},</h3>
              <p>You have successfully completed a transfer on your Nexus account. Below are the details:</p>
              <table border="0" cellpadding="10" cellspacing="0" width="100%" style="background: #f9f9f9; border-collapse: collapse; margin: 20px 0;">
                <tr>
                  <td style="border: 1px solid #ddd;">Recipient Name:</td>
                  <td style="border: 1px solid #ddd;">${transferDetails.recipientName}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd;">Account Number:</td>
                  <td style="border: 1px solid #ddd;">${transferDetails.accountNumber}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd;">Amount:</td>
                  <td style="border: 1px solid #ddd;">${transferDetails.amount}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd;">Description:</td>
                  <td style="border: 1px solid #ddd;">${transferDetails.description}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd;">Bank:</td>
                  <td style="border: 1px solid #ddd;">${transferDetails.bank}</td>
                </tr>
              </table>
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

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending confirmation email", error);
      } else {
        console.log("Confirmation email sent: " + info.response);
      }
    });

    res.status(200).json({ message: "Transfer successful!" });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error during transfer authorization", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
