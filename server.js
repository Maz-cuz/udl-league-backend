const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("UDL-League Backend Running 🚀");
});

/* =========================
   TEST DATABASE CONNECTION
========================= */
app.get("/test-db", (req, res) => {

    db.query("SELECT 1 + 1 AS result", (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "DB Working",
            result: results[0].result
        });

    });

});


/* =========================
   TEAMS
========================= */
app.get("/api/teams", (req, res) => {
    db.query("SELECT * FROM teams", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

/* =========================
   PLAYERS
========================= */
app.get("/api/players", (req, res) => {
    db.query("SELECT * FROM players", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

/* =========================
   FIXTURES
========================= */
app.get("/api/fixtures", (req, res) => {
    db.query("SELECT * FROM fixtures", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

/* =========================
   RESULTS
========================= */
app.get("/api/results", (req, res) => {
    db.query("SELECT * FROM results", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

/* =========================
   LEAGUE TABLE
========================= */
app.get("/api/table", (req, res) => {
    db.query(`
        SELECT t.team_name,
               s.played,
               s.wins,
               s.draws,
               s.losses,
               s.points
        FROM standings s
        JOIN teams t ON s.team_id = t.id
        ORDER BY s.points DESC
    `, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

/* =========================
   STATS
========================= */
app.get("/api/stats", (req, res) => {
    db.query(`
        SELECT first_name,
               last_name,
               goals,
               assists
        FROM players
        ORDER BY goals DESC
    `, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`UDL-League Server Running on port ${PORT}`);
});
