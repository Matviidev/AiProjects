const fs = require("fs");
const path = require("path");

const openai = require("../config/openai.config");

const CACHE_FILE_PATH = path.join(__dirname, "../embeddings/embeddings.csv");

const generatEembedding = async (text) => {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
};

const generatEembeddingWithCache = async (text) => {
  const cacheMap = readCache();

  if (cacheMap.has(text)) {
    return cacheMap.get(text);
  } else {
    const embeddingVector = await generatEembedding(text);

    appendToCache(text, embeddingVector);

    return embeddingVector;
  }
};

function readCache() {
  try {
    if (!fs.existsSync(CACHE_FILE_PATH)) {
      fs.writeFileSync(CACHE_FILE_PATH, "text\tembedding\n", "utf8");
      return new Map();
    }

    const cacheFile = fs.readFileSync(CACHE_FILE_PATH, "utf8");
    const lines = cacheFile.trim().split("\n");
    const cacheMap = new Map();

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line) {
        const [text, embedding] = line.split("\t");

        cacheMap.set(text, JSON.parse(embedding));
      }
    }

    return cacheMap;
  } catch (error) {
    return new Map();
  }
}

function appendToCache(text, embeddingVector) {
  const cacheMap = readCache();

  if (cacheMap.has(text)) {
    return;
  }

  const vectorString = JSON.stringify(embeddingVector);
  const newCacheLine = `${text}\t${vectorString}\n`;

  fs.appendFileSync(CACHE_FILE_PATH, newCacheLine, "utf8");

  cacheMap.set(text, embeddingVector);
}

const semanticSearch = async (req, res) => {
  const { search_term, target_list, k } = req.body;

  const searchTermEmbedding = await generatEembeddingWithCache(search_term);

  let similarities = [];

  for (let i = 0; i < target_list.length; i++) {
    const target = target_list[i];

    const targetEmbedding = await generatEembeddingWithCache(target);

    const similarity = cosineSimilarity(searchTermEmbedding, targetEmbedding);

    similarities.push({
      index: i,
      text: target,
      similarity: similarity,
    });
  }

  similarities.sort((a, b) => b.similarity - a.similarity);

  res.status(200).json(similarities.slice(0, k));
};

const cosineSimilarity = (vecA, vecB) => {
  return dotProduct(vecA, vecB) / (norm(vecA) * norm(vecB));
};

const dotProduct = (vecA, vecB) => {
  let product = 0;

  for (let i = 0; i < vecA.length; i++) {
    product += vecA[i] * vecB[i];
  }

  return product;
};

const norm = (vec) => {
  let sum = 0;

  for (let i = 0; i < vec.length; i++) {
    sum += vec[i] * vec[i];
  }

  return Math.sqrt(sum);
};

module.exports = { semanticSearch };
