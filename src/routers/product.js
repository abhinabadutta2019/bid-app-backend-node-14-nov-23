import fs from "fs";
import { Router } from "express";
const router = Router();
//route
router.get("/", (req, res) => {
  const data = fs.readFileSync("data.json");
  const products = JSON.parse(data);
  res.json(products);
});
//
// Add a new product route
router.post("/add-product", (req, res) => {
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

export { router as productRouter };
