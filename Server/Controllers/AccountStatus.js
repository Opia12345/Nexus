const { User } = require("../Models/User");

exports.AccountStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ isLocked: user.isLocked });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
