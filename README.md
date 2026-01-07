# OpenAI Projects

A collection of OpenAI API-powered applications built with Node.js and Express. This project demonstrates various use cases of OpenAI's API including chat completions, emotion analysis, meal planning, YouTube content analysis, and semantic search.

## Features

### 1. ChatGPT Clone (`/openai/chat`)

A simple chat completion endpoint that mimics ChatGPT functionality using GPT-4o-mini.

### 2. Emotion Analysis (`/openai/emotion`)

Analyzes text sentiment and classifies it into specified emotions using GPT-4o-mini.

### 3. Fridge Chef (`/openai/fridge-chef`)

Creates healthy meal plans based on available ingredients:

- Generates breakfast, lunch, and dinner recipes
- Respects daily calorie limits
- Generates meal images using DALL-E 3
- Returns structured meal data with titles, descriptions, and image URLs

### 4. YouTube Insights (`/openai/youtube-insights`)

Analyzes YouTube videos by:

- Downloading audio from YouTube videos
- Transcribing audio using Whisper (supports translation for non-English content)
- Generating insights including keywords and main topics

### 5. Semantic Search (`/openai/semantic-search`)

Performs semantic similarity search using embeddings:

- Uses text-embedding-3-small model
- Implements cosine similarity for matching
- Caches embeddings in CSV format for performance
- Returns top-k most similar items

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Matviidev/AiProjects.git
cd AiProjects
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your OpenAI API key:

```env
OPENAI_API_KEY=your_api_key_here
```

## Usage

1. Start the server:

```bash
node src/app.js
```

The server will start on port 3000. You should see:

```
Listening to requests on port 3000
```

## API Endpoints

### POST `/openai/chat`

Chat completion endpoint.

**Request Body:**

```json
{
  "messages": [{ "role": "user", "content": "Hello, how are you?" }]
}
```

**Response:**

```json
{
  "content": "I'm doing well, thank you for asking!"
}
```

### POST `/openai/emotion`

Analyze text emotion/sentiment.

**Request Body:**

```json
{
  "prompt": "I'm feeling great today!",
  "emotions": "Happy, Sad, Angry, Excited, Neutral"
}
```

**Response:**

```json
{
  "content": "Happy"
}
```

### POST `/openai/fridge-chef`

Generate healthy meal plans from ingredients.

**Request Body:**

```json
{
  "ingredients": "chicken, rice, vegetables, eggs",
  "kcal": 2000
}
```

**Response:**

```json
{
  "meals": [
    {
      "title": "Scrambled Eggs with Vegetables",
      "description": "...",
      "url": "https://..."
    },
    ...
  ]
}
```

### POST `/openai/youtube-insights`

Analyze YouTube video content.

**Request Body:**

```json
{
  "link": "https://www.youtube.com/watch?v=...",
  "not_english": false
}
```

**Response:**

```json
{
  "insights": {
    "keywords": ["keyword1", "keyword2"],
    "topics": [
      {
        "title": "Topic Title",
        "description": "Topic description"
      }
    ]
  }
}
```

### POST `/openai/semantic-search`

Perform semantic similarity search.

**Request Body:**

```json
{
  "search_term": "artificial intelligence",
  "target_list": [
    "machine learning",
    "deep learning",
    "neural networks",
    "cooking recipes"
  ],
  "k": 2
}
```

**Response:**

```json
[
  {
    "index": 0,
    "text": "machine learning",
    "similarity": 0.85
  },
  {
    "index": 1,
    "text": "deep learning",
    "similarity": 0.82
  }
]
```
