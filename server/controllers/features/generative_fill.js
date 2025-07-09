const axios = require("axios");

async function generativefill(req, res) {
  const { file, mask_file, prompt } = req.body;

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

    const data = response.data;
    const resultImages = data.urls.map((item)=>item[0]);
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
