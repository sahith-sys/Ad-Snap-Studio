const axios = require("axios");
const User = require("../models/user.js");

async function generateLifeStyleShotByText(req, res) {
  const { file, prompt, num_results, optimize_description, ratio, type, manual_placements } =
    req.body;
  const userId = req.userId;
  if(!userId) {
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
  if (!file || !prompt) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Missing required fields - Image or Prompt",
      });
  }
  try {
    const apiKey = process.env.BRIA_API_KEY;
    const payload = {
      file: file,
      scene_description: prompt,
      placement_type: type,
      num_results: num_results,
      optimize_description: optimize_description,
      sync: true,
    };
    if (ratio) {
      payload.aspect_ratio = ratio;
    }
    if (type == "automatic") {
      payload.shot_size = [900, 550];
    }
    if (type == "original") {
      payload.original_quality = true;
    }
    if(type== "manual_placement"){
      payload.manual_placement_selection = manual_placements;
      payload.shot_size = [900, 550];
    }
    const resp = await axios.post(
      `https://engine.prod.bria-api.com/v1/product/lifestyle_shot_by_text`,
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
    const data = resp.data.result;
    console.log(data);
    return res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error generating images", error.response?.data || error.message);
    return res.json({
      success: false,
      message: error.response?.data?.message || "Error generating images from text",
    });
  }
}
module.exports = {
  generateLifeStyleShotByText,
};
