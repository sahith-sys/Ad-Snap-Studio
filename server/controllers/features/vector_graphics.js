const axios = require("axios");

async function vectorGraphics(req, res) {
  const { prompt } = req.body;

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

    const data = resp.data;
    console.log(data);
    const resultUrls = data.result;
    return res.json({success:true, images: resultUrls}); 
  } catch (error) {
    console.error("Error in Vector Graphics", error);
    return res.json({
      success: false,
      error: error.message || "Something went wrong while processing your request",
    });
  }
}

module.exports = {
  vectorGraphics,
};
