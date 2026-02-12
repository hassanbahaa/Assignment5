const express = require("express");
const { connectDB } = require("./db/connection");
const { suppliersRoutes, productsRoutes, salesRoutes } = require("./routes");

const app = express();
connectDB();
const PORT = 3000;
app.use(express.json());

// Routes
app.use("/suppliers", suppliersRoutes);
app.use("/products", productsRoutes);
app.use("/sales", salesRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
