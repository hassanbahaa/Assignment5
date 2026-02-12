const { Router } = require("express");
const { connection } = require("../db/connection");
const { db } = require("../db/connection");
const router = Router();

// add product

router.post("/", async (req, res) => {
  try {
    let { productName, price, stockQuantity, supplierName, supplierID } =
      req.body;
    // check product data
    if (!productName || !price || !stockQuantity) {
      return res.status(400).json({ message: "all fields required" });
    }
    // check supplier data
    if (!supplierID && !supplierName) {
      return res.status(400).json({
        message: "SupplierID or SupplierName required",
      });
    }

    const [suppliers] = await db.execute(
      "SELECT SupplierID FROM suppliers WHERE SupplierID = ? OR SupplierName = ?",
      [supplierID || null, supplierName || null]
    );

    if (suppliers.length === 0) {
      return res.status(400).json({
        message: "Supplier not found",
      });
    }

    supplierID = suppliers[0].SupplierID;

    const result = await db.execute(
      "INSERT INTO products (ProductName, price,StockQuantity,SupplierID) VALUES (?, ?, ?,?)",
      [productName, price, stockQuantity, supplierID]
    );

    res.status(201).json({
      message: "product added successfully",
      success: true,
      id: result[0].insertId,
    });
  } catch (error) {
    return res.status(400).json({ message: "db error", data: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const query = "SELECT * FROM products";
    const result = await db.execute(query);
    const products = result[0];
    if (products.length === 0) {
      return res.status(404).json({
        message: "No products found",
      });
    }
    return res.status(200).json({
      message: "Get products successfully",
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(400).json({ message: "db error", data: error.message });
  }
});
module.exports = { productsRoutes: router };
