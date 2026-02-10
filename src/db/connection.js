// Database Connection Configuration
const mysql = require("mysql2");

// Create connection to MySQL database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "retail_store",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  }
  console.log(" Connected to db successfully");
});

module.exports = connection;
