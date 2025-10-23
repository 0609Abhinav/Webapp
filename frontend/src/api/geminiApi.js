export async function getGeminiResponse(userMessage) {
  const apiKey = "AIzaSyBX_NC6X9XUF5SfRaN7ATkeX7voY4-AxGM"; // Replace with your Gemini API key
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  const body = {
    contents: [
      {
        parts: [{ text: userMessage }],
      },
    ],
  };

  try {
    const res = await fetch(`${url}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    // Gemini responses are nested; extract text safely
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't understand that.";
  } catch (err) {
    console.error("Gemini API Error:", err);
    return "Error connecting to AI service.";
  }
}
