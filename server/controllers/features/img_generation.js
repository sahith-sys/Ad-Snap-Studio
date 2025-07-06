const axios = require("axios");

async function imgGeneration(req, res) {
  const { prompt } = req.body;
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

    const resp = await axios.post(
      `https://engine.prod.bria-api.com/v1/text-to-image/hd/${modelVersion}`,
      {
        prompt: prompt,
        num_results: 1,
        sync: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          api_token: apiKey, // Replace this with your actual API key
        },
      }
    );

    console.log(resp.data);
    res.json({success:true, data: resp.data});
  } catch (error) {
    console.error("Error in image generation:", error);
    return res.status(500).json({
      success: false,
      error: error?.response?.data?.error || "Something went wrong. Please try again.",
    });
  }
}

module.exports = {
  imgGeneration,
};
