const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "udl_league",
    port: process.env.DB_PORT || 3306
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed");
        console.log("DB Error:", err.message);
        return;
    }

    console.log("MySQL Connected Successfully");
});

module.exports = db;
