const mongoose = require("mongoose");
const recipeSchema = mongoose.Schema({
  title: String,
  image: String,
  imageType: String,
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});
const RecipeModel = mongoose.model("recipe", recipeSchema);
module.exports = { RecipeModel };
