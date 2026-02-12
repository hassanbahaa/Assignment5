const { Router } = require("express");
const { connection } = require("../db/connection");
const router = Router();

// add supplier
router.post("/", (req, res) => {
  const { supplierName, contactNumber } = req.body;

  if (!supplierName) {
    return res.status(400).json({
      message: "supplierName is required",
    });
  }
  const query = `INSERT INTO Suppliers (SupplierName, ContactNumber)
    VALUES (?, ?)`;

  connection.execute(query, [supplierName, contactNumber], (err, result) => {
    if (err) {
      return res.status(500).json({ message: `DB Error: ${err.message}` });
    }
    return res.status(201).json({
      message: "Supplier Created successfully",
      success: true,
      data: result.insertId,
    });
  });
});

// get supplier by letter
router.get("/search", (req, res) => {
  const letter = req.query.startsWith;
  const query = "SELECT * FROM suppliers WHERE SupplierName LIKE ?";
  connection.execute(query, [`${letter}%`], (err, results) => {
    if (err) {
      return res.status(500).json({ message: `DB Error: ${err.message}` });
    }
    if (results.length === 0) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }
    return res.status(200).json({
      message: "Get Supplier successfully",
      success: true,
      data: results,
    });
  });
});

// get all suppliers
router.get("/", (req, res) => {
  const query = "SELECT * FROM suppliers";
  connection.execute(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: `DB Error: ${err.message}` });
    }
    return res.status(200).json({
      message: "Get Suppliers successfully",
      success: true,
      data: results,
    });
  });
});

// get supplier by id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM suppliers WHERE SupplierID = ?";
  connection.execute(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: `DB Error: ${err.message}` });
    }
    if (results.length === 0) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }
    return res.status(200).json({
      message: "Get Supplier successfully",
      success: true,
      data: results[0],
    });
  });
});

module.exports = { suppliersRoutes: router };
