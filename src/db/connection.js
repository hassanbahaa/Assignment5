// Database Connection Configuration
const mysql = require("mysql2");

// Create connection to MySQL database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "retail_store_dev",
});

const db = connection.promise();

function connectDB() {
  connection.connect(function (err) {
    if (err) {
      console.error("Error connecting to database:", err.message);
      return;
    }
    console.log("Connected to db successfully");
  });
}
module.exports = { connection, connectDB, db };
