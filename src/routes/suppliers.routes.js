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

module.exports = { suppliersRoutes: router };
