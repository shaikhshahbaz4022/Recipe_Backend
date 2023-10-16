const axios = require("axios");
const { UserModel } = require("../Models/user.model");
const { RecipeModel } = require("../Models/recipe.model");
const APIKEY_Confidential = process.env.APIKEY;

//http://localhost:8080/recipe/get?query=pasta
const searchRecipe = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ msg: "Provide a query" });
    }

    // Assuming the user ID is available in the req.userId
    const userId = req.userID;

    const recipeGet = await axios.get(
      "https://api.spoonacular.com/recipes/complexSearch",
      {
        params: {
          query,
          apiKey: APIKEY_Confidential,
        },
      }
    );

    const recipeData = recipeGet.data.results;

    // Save each recipe with the associated user's ID
    const savedRecipes = [];
    for (const recipe of recipeData) {
      const { title, image, imageType, id } = recipe;
      const savedRecipe = new RecipeModel({
        title,
        image,
        imageType,
        userID: userId, // Associate the user ID with the recipe
        spoonacularRecipeId: id, // Store the Spoonacular recipe ID if needed
      });
      savedRecipes.push(await savedRecipe.save());
    }

    res.status(200).json({ data: recipeData, success: true });
  } catch (error) {
    res.status(500).json({ msg: error.message, success: false });
  }
};
// for recent search get route
//http://localhost:8080/recipe/recent
const savedRecipe = async (req, res) => {
  try {
    const { userID } = req;
    const recentSearch = await RecipeModel.find({ userID });

    res.status(200).json({ data: recentSearch, success: true });
  } catch (error) {
    res.status(500).json({ msg: error.message, success: false });
  }
};

module.exports = { searchRecipe, savedRecipe };
