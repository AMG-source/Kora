// import express
const express = require("express");

// initialize express
const app = express();
const dotenv = require("dotenv");
dotenv.config();

// port number
const port = process.env.PORT || 5000;
const cors = require("cors");
const { readdirSync } = require("fs");
const { connectDb } = require("./db/connection");

// handling connection erros
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

connectDb();

// GET,PUT,POST,DELETE
app.get("/", (req, res) => {
  res.send(`<center><h1>Server Running on PORT : ${port} </h1></center>`);
});

// dynamically include routes
readdirSync("./routes").map((route) =>
  app.use("/api", require(`./routes/${route}`))
);

// listen to port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
