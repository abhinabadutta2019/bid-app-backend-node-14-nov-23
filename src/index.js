import express from "express";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { productRouter } from "./routers/product.js";
import http from "http";

const app = express();
const server = http.createServer(app);
import { Server } from "socket.io";

const socketIO = new Server(server, {
  // Use the Server class
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
dotenv.config();
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
//
///////mongoDB cloud//////////////////
let uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.te788iv.mongodb.net/assign-socket-io-bid-app-nodejs-nov-23?retryWrites=true&w=majority`;
//
async function connectToMongoDB() {
  try {
    //if mongoDB uri is correct
    //if it is connected
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    //if error in connection or - in mongoDB uri
    console.error("MongoDB connection error:", error);
  }
}
// Call the async function to connect to MongoDB
connectToMongoDB();
////////////////////////////////////////////
//

//
//
// routes
app.use("/product", productRouter);
//
const PORT = process.env.PORT || 4000;
//
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
