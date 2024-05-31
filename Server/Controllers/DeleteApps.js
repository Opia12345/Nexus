const { App } = require("../Models/User");

exports.DeleteApp = async (req, res) => {
  const { userId } = req.params;
  try {
    const deletedApp = await App.findByIdAndDelete(userId);

    if (!deletedApp) {
      return res.status(404).json({ message: "App not found" });
    }

    return res.status(200).json({ message: "App deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while deleting the app" });
  }
};
