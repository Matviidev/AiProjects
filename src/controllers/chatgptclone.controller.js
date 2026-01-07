const openai = require("../config/openai.config");

const generateChatCompletion = async (req, res) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: req.body.messages,
    temperature: 0.7,
  });

  content = response.choices[0].message.content;

  res.status(200).json({
    content: content,
  });
};

module.exports = { generateChatCompletion };
