const axios = require("axios");

async function generateLifeStyleShotByText(req, res) {
  const { file, prompt, num_results, optimize_description, ratio, type } =
    req.body;

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
