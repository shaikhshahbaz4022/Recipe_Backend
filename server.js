const express = require("express");
const app = express();
const cors = require("cors");
const { connection } = require("./Config/db");
const { userRouter } = require("./Routes/user.routes");
const { recipeRouter } = require("./Routes/recipe.routes");
const { authenticate } = require("./Middleware/Auth");
app.use(express.json());
app.use(cors());
require("dotenv").config();
const PORT = process.env.PORT;

app.use("/user", userRouter);
app.use(authenticate);
app.use("/recipe", recipeRouter);

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Server is Connected to Database Succesfully");
  } catch (error) {
    console.log(error.message);
  }
  console.log(`Server is Connected to Port:${PORT}`);
});
