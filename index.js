const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const PORT = 4000;
const fs = require("fs");

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3048",
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
  },
});
//
// Enable CORS for all routes
app.use(cors());
//
const savedData = fs.readFileSync("data.json");
const objectData = JSON.parse(savedData);

// console.log(savedData, "savedData");
// console.log(objectData, "objectData");

//route
app.get("/api", (req, res) => {
  const data = fs.readFileSync("data.json");
  const products = JSON.parse(data);
  res.json(products);
});
//

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
