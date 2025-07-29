const axios = require("axios");
const User = require("../../models/user.js");

async function generateShadow(req, res) {
  const { file, shadow_type, shadow_intensity, shadow_color } = req.body;
  const userId = req.userId;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User login is required.",
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }
  if (user.credits === 0 || user.credits < 0) {
    return res.status(400).json({
      success: false,
      message: "Insufficient credits.",
    });
  }
  if (!file) {
    return res.json({ success: false, message: "File cannot be empty" });
  }

  const apiKey = process.env.BRIA_API_KEY;
  const payload = {
    file: file,
    type: shadow_type,
    shadow_intensity: shadow_intensity,
    shadow_color: shadow_color,
  };
  try {
    const resp = await axios.post(
      `https://engine.prod.bria-api.com/v1/product/shadow`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          api_token: apiKey,
        },
      }
    );
    await User.findByIdAndUpdate(userId, {
      credits: user.credits - 1,
    });

    const data = resp.data.result_url;
    console.log(data);
    return res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error(
      "Error generating shadow",
      error.response?.data || error.message
    );
    return res.json({
      success: false,
      message: error.response?.data?.message || "Error generating shadow",
    });
  }
}
module.exports = { generateShadow };
