const { App } = require("../Models/User");

exports.allApps = async (req, res) => {
  try {
    const apps = await App.find(); // Fetch all apps from the database
    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch apps" });
  }
};
