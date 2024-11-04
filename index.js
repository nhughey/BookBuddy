const express = require("express");
const cors = require("cors"); 
const app = express();
require("dotenv").config();
const client = require("./db/client");
app.use(cors());
client.connect();
const PORT = 3000;
app.use(express.json());

// we're registering the routes in /api/index.js ===> IOW, request to /api ---> send request to /api/index.js
app.use("/api", require("./api"));

app.get("/", (req, res) => {
  res.send("Hello from our server");
});

app.get("*", (req, res) => {
  res.status(404).send({
    error: "404 - Not Found",
    message: "No route found for the requested URL",
  });
});

app.use((error, req, res, next) => {
  console.log("ERROR ", error);
  if (res.statusCode < 400) res.status(500);
  res.send({
    message: error.message,
    name: error.name,
  });
});

app.listen(PORT, () => {
  console.log(`Server alive on port ${PORT}`);
});
