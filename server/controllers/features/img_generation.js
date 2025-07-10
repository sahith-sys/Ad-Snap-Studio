const axios = require("axios");

async function imgGeneration(req, res) {
  const { prompt, aspect_ratio, medium, num_results } = req.body;
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
          api_token: apiKey, // Replace this with your actual API key
        },
      }
    );

    console.log(resp.data);
    console.log(prompt, aspect_ratio, medium, num_results);
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
