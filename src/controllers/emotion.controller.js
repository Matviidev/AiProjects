const openai = require("../config/openai.config");

const gptAnalyzeEmotions = async (req, res) => {
  system_prompt = `
    You are capable of analyzing the sentiment of given text.
    Tou will classify the sentiment of a given text into ONLY ONE of these emotions: ${req.body.emotions}.
    After classifying the text, respond with the emotion ONLY.
    `;

  user_prompt = `The text to analyze is: ${req.body.prompt}`;

  messages = [
    { role: "system", content: system_prompt },
    { role: "user", content: user_prompt },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages,
    temperature: 0,
    max_tokens: 128,
  });

  content = response.choices[0].message.content;

  if (content === "") {
    content = "N/A";
  }

  res.status(200).json({
    content: content,
  });
};

module.exports = { gptAnalyzeEmotions };
