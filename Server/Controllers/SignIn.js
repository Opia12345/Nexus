const { User } = require("../Models/User");
const bcrypt = require("bcrypt");
const yup = require("yup");
const jwt = require("jsonwebtoken");

const Validation = yup.object().shape({
  userID: yup.string().required("User ID is required"),
  Password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWTSECRET, {
    expiresIn: 5 * 24 * 60 * 60,
  });
};

exports.signIn = async (req, res) => {
  const { userID, Password } = req.body;

  try {
    const validationSchema = Validation;
    await validationSchema.validate(
      { userID, Password },
      { abortEarly: false }
    );
    const existingUser = await User.findOne({ userID });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const PasswordMatch = await bcrypt.compare(Password, existingUser.Password);

    if (!PasswordMatch) {
      return res.status(401).json({ error: "Incorrect Password" });
    }

    // Create the token and set the cookie before sending the initial response.
    const token = createToken(existingUser._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 5 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "None",
    });

    const response = {
      message: "Sign in successful",
      userID,
      userId: existingUser._id,
      token,
      LastName: existingUser.LastName,
      FirstName: existingUser.FirstName,
      userEmail: existingUser.Email,
      userAccount: existingUser.accountNumber,
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
    console.log(err);
  }
};
