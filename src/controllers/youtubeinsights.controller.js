const path = require("path");
const sanitize = require("sanitize-filename");
const ytdl = require("ytdl-core-discord");
const openai = require("../config/openai.config");
const fs = require("fs");

const generateYouTubeInsights = async (req, res) => {
  const filePath = await youtubeAudioDownloader(req.body.link);

  const transcriptFilename = await generateTranscription(
    filePath,
    req.body.not_english
  );

  const insights = await generateInsights(transcriptFilename);
  res.status(200).json({
    insights: insights,
  });
};

const youtubeAudioDownloader = async (link) => {
  if (!link.includes("youtube.com")) {
    return false;
  }
  try {
    const info = await ytdl.getInfo(link);
    const audioFormat = ytdl.chooseFormat(info.formats, {
      filter: "audioonly",
    });
    const outputFilePath = `./${sanitize(info.videoDetails.title)}.mp3`;

    const stream = ytdl.downloadFromInfo(info, { filter: "audioonly" });
    const writeStream = fs.createWriteStream(outputFilePath);
    stream.pipe(writeStream);
    return new Promise((resolve, reject) => {
      writeStream.on("finish", () => {
        resolve(outputFilePath);
      });
      writeStream.on("error", (error) => {
        reject(error);
      });
    });
  } catch (error) {
    console.error("Error", error.message);
    return false;
  }
};
const generateTranscription = async (audio_file, not_english) => {
  if (!fileExists(audio_file)) {
    return;
  }
  transcript = "";
  if (not_english) {
    transcript = await openai.audio.translations.create({
      file: fs.createReadStream(audio_file),
      model: "whisper-1",
    });
  } else {
    transcript = await openai.audio.transcription.create({
      file: fs.createReadStream(audio_file),
      model: "whisper-1",
    });
  }

  const { name, ext } = path.parse(audio_file);
  const transcriptFilename = `transcript-${name}.txt`;
  const transcriptText = transcript.text;

  try {
    fs.writeFileSync(transcriptFilename, transcriptText);
  } catch (error) {
    console.error("Error writing transcript file: ", error);
  }

  return transcriptFilename;
};

function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

const generateInsights = async (transcript_filename) => {
  if (!fileExists(transcript_filename)) {
    return;
  }

  let transcript_text = "";
  try {
    const data = fs.readFileSync(transcript_filename, "utf8");
    transcript_text = data.toString();
  } catch (error) {
    return;
  }

  system_prompt = `
  You are the insightful AI assistant. 
  Please analyze the following YouTube content and provide important keywords and main topics covered.
  YouTube Content: ${transcript_text}
  `;

  prompt = `
  Please generate the output EXACTLY in this JSON format:
  {
    "keywords": [
        "First Keyword"
    ],
    "topics": [
        {
            "title": "First Title",
            "description": "First Description"
        }
    ]
  }
  `;
  messages = [
    { role: "system", content: system_prompt },
    { role: "user", content: prompt },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages,
    temperature: 1,
    max_tokens: 2048,
  });

  insights = response.choices[0].message.content;
  return JSON.parse(insights);
};

module.exports = { generateYouTubeInsights };
