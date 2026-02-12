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

// update product by name
router.patch("/:name", async (req, res) => {
  const { name } = req.params;
  const { price } = req.body;
  try {
    if (price === undefined) {
      return res.status(400).json({
        message: "Price is required",
      });
    }

    const [result] = await db.execute(
      "UPDATE products SET price = ? WHERE ProductName = ?",
      [price, name]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Price updated successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Database error",
      error: err.message,
    });
  }
});

router.delete("/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const [result] = await db.execute(
      "DELETE FROM products WHERE ProductName = ?",
      [name]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Database error",
      error: err.message,
    });
  }
});

// get all products
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

router.get("/highest-stock", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT *
      FROM products
      ORDER BY StockQuantity DESC
      LIMIT 1
    `);

    res
      .status(200)
      .json({ message: "got data successfully", success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/never-sold", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT p.*
      FROM products p
      LEFT JOIN sales s
        ON p.ProductID = s.ProductID
      WHERE s.ProductID IS NULL
    `);

    res
      .status(200)
      .json({ message: "got data successfully", success: true, data: rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = { productsRoutes: router };
