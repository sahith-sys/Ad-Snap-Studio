const axios = require("axios");

async function productPackshot(req, res) {
  const { file, bg_color } = req.body;

  if (!file) {
    return res.status(400).json({
      success: false,
      error: "file is required",
    });
  }
  try {
    const apiKey = process.env.BRIA_API_KEY;

    const payload = {
      sku: "12345",
      file, // full base64 with prefix
      background_color: bg_color || "#FFFFFF",
    };

    console.log("Sending payload:", JSON.stringify(payload).slice(0, 100)); // log for debug

    const resp = await axios.post(
      `https://engine.prod.bria-api.com/v1/product/packshot`,
      {
        sku: "12345",
        file: file,
        background_color: bg_color || "#FFFFFF",
      },
      {
        headers: {
          "Content-Type": "application/json",
          api_token: apiKey,
        },
      }
    );
    const data = resp.data;
    console.log("Bria API Response:", data);
    return res.json({ success: true, data: data.result_url });
  } catch (error) {
    console.error("Error in productPackshot", error);
    return res.json({
      success: false,
      error: "Something went wrong while processing your request.",
    });
  }
}
module.exports = {
  productPackshot,
};
