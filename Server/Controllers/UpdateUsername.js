const nodemailer = require("nodemailer");
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
  userName: yup.string().required("User Name is required"),
});

exports.updateUsername = async (req, res) => {
  const { userName } = req.body;
  const { userId } = req.params;

  try {
    await Validation.validate({ userName }, { abortEarly: false });

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.userName = userName;

    await user.save();

    let mailOptions = {
      from: process.env.USERMAIL,
      to: user.Email,
      subject: "Your Email Address Has been Updated!",
      html: `<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 400px; background: white; color: black;">
        <tr>
            <td align="center">
                <img src="cid:logo" alt="Logo" style="width: 100%; display: block;">
            </td>
        </tr>
        <tr>
        <td style="padding: 40px;">
        <h3 style="margin-top: 0;">Hello ${user.userName} 👋.</h3>
        <p>Your User Name has been successfully updated.</p>
        <p>If you did not request this change, please contact us immediately at <u>pascalanthony643@gmail.com</u></p>
        
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

    res.status(200).json({
      message: "User Name updated successfully",
      userName: user.userName,
    });
  } catch (error) {
    let errorMessage = "An error occurred";
    if (error.name === "ValidationError") {
      errorMessage = "Validation error: ";
      error.errors.forEach((err) => {
        errorMessage += `${err}`;
      });
    } else if (error.message.includes("duplicate key error")) {
      errorMessage = "Email already in use";
    }
    res.status(400).json({ message: errorMessage });
  }
};
