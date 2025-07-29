const axios = require("axios");
const User = require("../../models/user.js");

async function vectorGraphics(req, res) {
  const { prompt } = req.body;
  const userId = req.userId;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User login is required",
    });
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  if (user.credits === 0 || user.credits < 0) {
    return res.status(404).json({
      success: false,
      message: "Insufficient credits",
    });
  }

  if (!prompt) {
    return res.json({ success: false, error: "prompt required" });
  }
  const apiKey = process.env.BRIA_API_KEY;
  try {
    const modelVersion = "2.3";
    const resp = await axios.post(
      `https://engine.prod.bria-api.com/v1/text-to-vector/fast/${modelVersion}`,
      {
        prompt: prompt,
        num_results: 4,
        sync: true,
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

    const data = resp.data;
    console.log(data);
    const resultUrls = data.result;
    return res.json({ success: true, images: resultUrls });
  } catch (error) {
    console.error("Error in Vector Graphics", error);
    return res.json({
      success: false,
      error:
        error.message || "Something went wrong while processing your request",
    });
  }
}

module.exports = {
  vectorGraphics,
};
