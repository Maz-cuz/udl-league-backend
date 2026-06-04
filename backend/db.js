const mysql = require("mysql2");

// Create a connection pool instead of single connection
const pool = mysql.createPool(process.env.MYSQL_URL);

// Test the connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ DB Error:", err.message);
    } else {
        console.log("✅ Connected to Railway MySQL");
        connection.release();
    }
});

// Export promise-based pool for async/await
module.exports = pool.promise();