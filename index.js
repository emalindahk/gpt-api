require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { Configuration, OpenAIApi } = require("openai");
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hey this is my API  🥳");
});

app.post("/questions", async (req, res) => {
  const { category, difficulty } = req.body;

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    n: 1,
    stream: false,
    messages: [
      {
        role: "system",
        content: `You are a trivia bot that generates ${difficulty} level ${category} questions.`,
      },
      {
        role: "user",
        content: `Generate 10 questions of ${difficulty} difficulty level in the category of ${category}. Each question should have four options (A, B, C, D) and the correct answer should be indicated at different options. Use the format:\n'1. Question?\nA) Option A\nB) Option B\nC) Option C\nD) Option D\nAnswer: Correct Option and Answer'.`,
      },
    ],
  });

  const responseData = response.data.choices[0].message.content;

  res.json(responseData);
});

const PORT = process.env.PORT || 8000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

module.exports = app;
