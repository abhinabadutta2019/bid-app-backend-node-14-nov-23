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
// Enable JSON parsing middleware
app.use(express.json());
//
const savedData = fs.readFileSync("data.json");
const objectData = JSON.parse(savedData);
//
socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  //
  // Emit a custom event to notify the frontend about the new user
  socketIO.emit("userConnected", socket.id);
  //
  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    //
    // Emit a custom event to notify the frontend about the disconnected user
    socketIO.emit("userDisconnected", socket.id);
  });
});

//route
app.get("/api", (req, res) => {
  const data = fs.readFileSync("data.json");
  const products = JSON.parse(data);
  res.json(products);
});
//
// Add a new product route
app.post("/api/add-product", (req, res) => {
  try {
    const data = fs.readFileSync("data.json");
    let products = JSON.parse(data);

    // Make sure products is an array, initialize as an empty array if not
    if (!Array.isArray(products)) {
      products = [];
    }

    const newProduct = {
      id: products.length + 1,
      name: req.body.name,
      price: req.body.price,
      owner: req.body.owner,
      last_bidder: req.body.last_bidder,
    };

    // Add the new product to the existing array
    products.push(newProduct);

    fs.writeFileSync("data.json", JSON.stringify(products, null, 2));

    // Notify connected clients about the new product
    socketIO.emit("newProductAdded", newProduct);

    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
