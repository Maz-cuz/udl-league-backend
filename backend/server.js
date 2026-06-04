require('dotenv').config();

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// TEST DB CONNECTION
console.log("MYSQL_URL:", process.env.MYSQL_URL);

// Test database connection on startup
async function testDatabase() {
    try {
        const [result] = await db.query("SELECT 1");
        console.log("✅ Database connection successful");
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
    }
}
testDatabase();

// Health check endpoint for Render
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date() });
});

// Use PORT from environment (Render sets this automatically)
const PORT = process.env.PORT || 5000;

// Bind to 0.0.0.0 - REQUIRED for Render
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏆 UDL-League Server Running on port ${PORT}`);
});