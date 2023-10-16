const express = require("express");
const app = express();
const cors = require("cors");
const { connection } = require("./Config/db");
app.use(express.json());
app.use(cors());
require("dotenv").config();
const PORT = process.env.PORT;

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Server is Connected to Database Succesfully");
  } catch (error) {
    console.log(error.message);
  }
  console.log(`Server is Connected to Port:${PORT}`);
});
