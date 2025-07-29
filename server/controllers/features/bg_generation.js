const axios = require("axios");
const User = require("../../models/user.js");

async function bgGeneration(req, res) {
  const { prompt, file, num_results} = req.body;
  const userId = req.userId;
  if(!userId){
    return res.status(400).json({
      success: false,
      message: "User login required",
    })
  }
  const user = await User.findById(userId);
  if(!user){
    return res.status(404).json({
      success:false,
      message: "User not found",
    })
  }
  if(user.credits === 0  || user.credits < 0){
    return res.status(400).json({
      success: false,
      message: "Insufficient credits",
    })
  }
  if (!file) {
    return res.status(400).json({
      success: false,
      error: "Image file is required.",
    });
  }
  if(!prompt || !prompt.trim()) {
    return res.status(400).json({
      success: false,
      error: "Prompt cannot be empty.",
    });
  }
  try {
    const resp = await axios.post(
      `https://engine.prod.bria-api.com/v1/background/replace`,
      {
        bg_prompt: prompt,
        num_results: num_results,
        sync: true,
        file: file,
      },
      {
        headers: {
          "Content-Type": "application/json",
          api_token: process.env.BRIA_API_KEY,
        },
      }
    );
    await User.findByIdAndUpdate(userId, {
      credits: user.credits - 1,
    });
    const data = resp.data.result;
    console.log("Background generation response:", data);
    return res.json({ success: true, images: data});
  } catch (error) {
    console.error("Error in background generation", error);
    return res.json({
      success: false,
      error:
        error?.response?.data?.error ||
        "Something went wrong. Please try again.",
    });
  }
}

module.exports = {
  bgGeneration,
};
