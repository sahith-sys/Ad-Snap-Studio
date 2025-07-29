const axios = require("axios");
const User = require("../../models/user.js");

async function generativefill(req, res) {
  const { file, mask_file, prompt } = req.body;
  const userId = req.userId;
  if(!userId){
    return res.status(400).json({
      success: false,
      message: "User login is required",
    });
  }
  const user = await User.findById(userId);
  if(!user){
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  if(user.credits === 0 || user.credits < 0) {
    return res.status(400).json({
      success: false,
      message: "Insufficient credits",
    });
  }
  if (!file || !mask_file || !prompt) {
    return res.status(400).json({
      success: false,
      error: "file, mask_file, and prompt are required",
    });
  }

  try {
    const apiKey = process.env.BRIA_API_KEY;

    const payload = {
      file: file, 
      mask_file: mask_file, 
      prompt: prompt,
      mask_type: "manual"
    };
    console.log("Bria GenFill payload:", payload);

    const response = await axios.post(
      `https://engine.prod.bria-api.com/v1/gen_fill`,
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
    const data = response.data;
    const resultImages = data.urls;
    console.log("Bria GenFill response:", data);
    return res.json({ success: true, images: resultImages});

  } catch (error) {
    console.error("Error in generativefill:", error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: "Something went wrong in backend while processing your request.",
    });
  }
}

module.exports = { generativefill };
