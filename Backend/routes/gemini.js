const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required.' });

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return res.status(response.status).json({ error: 'Gemini API request failed.' });
    }

    const data = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t understand that.";

    res.json({ reply });
  } catch (error) {
    console.error('Gemini proxy error:', error.message);
    res.status(500).json({ error: 'AI service failed.' });
  }
});

module.exports = router;
