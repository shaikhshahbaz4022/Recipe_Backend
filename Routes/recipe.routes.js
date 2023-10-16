const express = require("express");
const {
  searchRecipe,
  savedRecipe,
} = require("../Controllers/recipe.controller");
const recipeRouter = express.Router();

recipeRouter.get("/get", searchRecipe);
recipeRouter.get("/recent", savedRecipe);
module.exports = { recipeRouter };
