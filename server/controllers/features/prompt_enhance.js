const axios = require('axios');

async function promptEnhancement(req, res) {
  const { prompt } = req.body;

  console.log('Incoming Prompt:', prompt);

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Prompt cannot be empty.',
    });
  }

  try {
    const apiKey = process.env.BRIA_API_KEY;
    console.log('Using API Key:', apiKey);

    const resp = await axios.post(
      `https://engine.prod.bria-api.com/v1/prompt_enhancer`,
      { prompt },
      {
        headers: {
          'Content-Type': 'application/json',
          api_token: apiKey,
        },
      }
    );

    console.log('Bria API Response:', resp.data);
    res.json({ success: true, data: resp.data });

  } catch (error) {
    console.log('Error details:', JSON.stringify(error, null, 2));
    res.status(error.response?.status || 500).json({
      success: false,
      error: error?.response?.data?.error || 'Something went wrong. Please try again.',
    });
  }
}

module.exports = {
  promptEnhancement,
};
