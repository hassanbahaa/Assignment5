const { Router } = require("express");
const { db } = require("../db/connection");
const router = Router();

router.get("/sales-details", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT
        p.ProductName,
        s.QuantitySold,
        s.SaleDate
      FROM sales s
      JOIN products p
        ON s.ProductID = p.ProductID
    `);

    res
      .status(200)
      .json({ message: "got data successfully", success: true, data: rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = { salesRoutes: router };
