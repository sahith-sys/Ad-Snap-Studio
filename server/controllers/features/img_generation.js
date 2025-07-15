const axios = require("axios");
const User = require("../../models/user.js");
async function imgGeneration(req, res) {
  const { prompt, aspect_ratio, medium, num_results } = req.body;
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
  if (!prompt || !prompt.trim()) {
    return res.status(400).json({
      success: false,
      error: "Prompt cannot be empty.",
    });
  }
  try {
    const apiKey = process.env.BRIA_API_KEY;
    const axios = require("axios");

    const modelVersion = "2.2";
    console.log(prompt, aspect_ratio, medium, num_results);

    const resp = await axios.post(
      `https://engine.prod.bria-api.com/v1/text-to-image/hd/${modelVersion}`,
      {
        prompt: prompt,
        num_results,
        sync: true,
        aspect_ratio,
        medium,
      },
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
    console.log(resp.data);
    console.log(prompt, aspect_ratio, medium, num_results);
    res.json({ success: true, data: resp.data });
  } catch (error) {
    console.error("Error in image generation:", error);
    return res.status(500).json({
      success: false,
      error:
        error?.response?.data?.error ||
        "Something went wrong. Please try again.",
    });
  }
}

module.exports = {
  imgGeneration,
};
