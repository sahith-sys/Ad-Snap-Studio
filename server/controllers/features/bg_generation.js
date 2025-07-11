const axios = require("axios");

async function bgGeneration(req, res) {
  const { prompt, file, num_results} = req.body;
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
