const bcrypt = require("bcrypt");
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
  Password: yup
    .string()
    .min(8, "Password must be more than 8 characters")
    .required("Please input your Password"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("Password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

exports.updatePassword = async (req, res) => {
  const { Password } = req.body;
  const { userId } = req.params;

  try {
    await Validation.validate(
      { Password, confirmPassword: req.body.confirmPassword },
      { abortEarly: false }
    );

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.Password = bcrypt.hashSync(Password, 10);

    await user.save();

    let mailOptions = {
      from: process.env.USERMAIL,
      to: user.Email,
      subject: "Nexus Bank: Your Password Has been Updated!",
      html: `<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background: white; color: #333; font-family: Arial, sans-serif; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <tr>
          <td align="center" style="background-color: white; padding: 20px 0;">
              <img src="cid:logo" alt="Nexus Bank Logo" style="width: 150px; display: block;">
          </td>
      </tr>
      <tr>
      <td style="padding: 40px;">
      <h3 style="color: #004080; margin-top: 0;">Dear ${user.FirstName},</h3>
      <p>We are writing to confirm that the password associated with your Nexus Bank account has been successfully updated.</p>
      <p>If you did not request this change, please contact our customer support team immediately at chinyereozoemelam2@gmail.com or call us at +234 817 079 5643.</p>
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

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error sending mail ", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
