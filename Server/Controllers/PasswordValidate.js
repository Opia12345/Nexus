const { User } = require("../Models/User");
const bcrypt = require("bcrypt");
const yup = require("yup");

const Validation = yup.object().shape({
  Password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

exports.passwordValidate = async (req, res) => {
  const { Password } = req.body;
  const { userId } = req.params;

  try {
    const validationSchema = Validation;
    await validationSchema.validate({ Password }, { abortEarly: false });
    const existingUser = await User.findOne({ _id: userId });
    const PasswordMatch = await bcrypt.compare(Password, existingUser.Password);

    if (!PasswordMatch) {
      return res.status(401).json({ error: "Incorrect Password" });
    }

    const response = {
      message: "Transfer successful!",
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
    console.log(err);
  }
};
