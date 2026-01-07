const openai = require("../config/openai.config");

const createHealthyMeals = async (req, res) => {
  system_role_content = "You are a talented cook.";
  prompt = `
    Create a healthy daily meal plan for breakfast, lunch and dinner based on 
    the following ingredients ${req.body.ingredients}.
    Explain each recipe.
    The total daily intake of kcal should be below ${req.body.kcal}.
    Assign a suggestive and concise title to each meal.
    Your answer should end with 'Titles: ' and an ordered list of the title of each recipe.
    `;

  messages = [
    { role: "system", content: system_role_content },
    { role: "user", content: prompt },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages,
    temperature: 1,
    max_tokens: 1024,
    n: 1,
  });

  meals = response.choices[0].message.content;

  const titles = extractMealTitles(meals);
  let mealList = extractMeals(meals, titles);

  const promises = mealList.map((meal) => {
    return createMealImage(meal["title"], "White background")
      .then((url) => {
        meal["url"] = url;
        return meal;
      })
      .catch((err) => {
        console.log("Error creating a meal image: ", err);
      });
  });

  mealList = await Promise.all(promises);

  res.status(200).json({
    meals: mealList,
  });
};

function extractMealTitles(meals) {
  const lines = meals.split("\n");

  const lastThreeLines = lines.slice(-3);

  const titles = lastThreeLines.map((line) =>
    line.replace(/^\d+\.\s*|^\d+\-\s*/, "")
  );

  return titles;
}

function extractMeals(inputString, titles) {
  inputString = inputString.split("Titles:")[0];
  const lines = inputString.split("\n");
  const meals = [];
  let currentMeal = null;

  lines.forEach((line) => {
    const title = titles.find((t) => line.includes(t));
    if (title) {
      if (currentMeal) {
        meals.push(currentMeal);
      }
      currentMeal = {
        title: title,
        description: "",
        url: "",
      };
    } else if (currentMeal) {
      currentMeal.description += line + "\n";
    }
  });

  if (currentMeal) {
    meals.push(currentMeal);
  }
  return meals;
}

async function createMealImage(title, extra = "") {
  image_prompt = `${title}, ${extra}, high quality food photography`;

  const image = await openai.images.generate({
    model: "dall-e-3",
    prompt: image_prompt,
    n: 1,
    size: "1024x1024",
  });
  const imageUrl = image.data[0].url;
  return imageUrl;
}
module.exports = { createHealthyMeals };
