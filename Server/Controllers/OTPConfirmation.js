const { User } = require("../Models/User");
const yup = require("yup");

const Validation = yup.object().shape({
  otp: yup.number().required("OTP is required"),
});

exports.OTPConfirmation = async (req, res) => {
  const { otp } = req.body;
  try {
    await Validation.validate({ otp }, { abortEarly: false });
    const existingUser = await User.findOne({ otp });

    if (!existingUser || Date.now() > existingUser.otpExpiration) {
      return res.status(400).json({ error: "OTP has expired!" });
    }

    existingUser.otp = null;
    existingUser.otpExpiration = null;
    await existingUser.save();

    return res.status(200).json({ message: "OTP is valid" });
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
};
