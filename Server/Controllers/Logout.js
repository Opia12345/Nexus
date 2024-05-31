const jwt = require("jsonwebtoken");

exports.logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      maxAge: 0,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Error during logout:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
