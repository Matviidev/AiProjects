const express = require("express");

const { gptAnalyzeEmotions } = require("./controllers/emotion.controller");
const {
  generateChatCompletion,
} = require("./controllers/chatgptclone.controller");

const { createHealthyMeals } = require("./controllers/fridgechef.controller");
const {
  generateYouTubeInsights,
} = require("./controllers/youtubeinsights.controller");

const { semanticSearch } = require("./controllers/semanticsearch.controller");

const app = express();

app.listen(3000, () => console.log("Listening to requests on port 3000"));

app.use(express.json());

app.post("/openai/emotion", gptAnalyzeEmotions);
app.post("/openai/chat", generateChatCompletion);
app.post("/openai/fridge-chef", createHealthyMeals);
app.post("/openai/youtube-insights", generateYouTubeInsights);
app.post("/openai/semantic-search", semanticSearch);
