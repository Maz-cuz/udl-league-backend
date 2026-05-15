
CREATE DATABASE IF NOT EXISTS udl_league;
USE udl_league;

/* =========================
   USERS
========================= */
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role ENUM('admin','manager','referee') DEFAULT 'manager',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* =========================
   TEAMS
========================= */
CREATE TABLE teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(100),
    coach_name VARCHAR(100),
    contact VARCHAR(50),
    logo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* =========================
   PLAYERS
========================= */
CREATE TABLE players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    jersey_number INT,
    position VARCHAR(50),
    team_id INT,
    photo VARCHAR(255),
    status ENUM('active','injured','suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

/* =========================
   FIXTURES
========================= */
CREATE TABLE fixtures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    home_team_id INT,
    away_team_id INT,
    match_date DATETIME,
    venue VARCHAR(100),
    status ENUM('upcoming','live','finished') DEFAULT 'upcoming',
    FOREIGN KEY (home_team_id) REFERENCES teams(id),
    FOREIGN KEY (away_team_id) REFERENCES teams(id)
);

/* =========================
   RESULTS
========================= */
CREATE TABLE results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fixture_id INT,
    home_score INT DEFAULT 0,
    away_score INT DEFAULT 0,
    FOREIGN KEY (fixture_id) REFERENCES fixtures(id)
);

/* =========================
   GOALS
========================= */
CREATE TABLE goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fixture_id INT,
    player_id INT,
    minute_scored INT,
    FOREIGN KEY (fixture_id) REFERENCES fixtures(id),
    FOREIGN KEY (player_id) REFERENCES players(id)
);

/* =========================
   ASSISTS
========================= */
CREATE TABLE assists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fixture_id INT,
    player_id INT,
    FOREIGN KEY (fixture_id) REFERENCES fixtures(id),
    FOREIGN KEY (player_id) REFERENCES players(id)
);

/* =========================
   YELLOW CARDS
========================= */
CREATE TABLE yellow_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fixture_id INT,
    player_id INT,
    FOREIGN KEY (fixture_id) REFERENCES fixtures(id),
    FOREIGN KEY (player_id) REFERENCES players(id)
);

/* =========================
   RED CARDS
========================= */
CREATE TABLE red_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fixture_id INT,
    player_id INT,
    FOREIGN KEY (fixture_id) REFERENCES fixtures(id),
    FOREIGN KEY (player_id) REFERENCES players(id)
);

/* =========================
   STANDINGS (LEAGUE TABLE)
========================= */
CREATE TABLE standings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT UNIQUE,
    played INT DEFAULT 0,
    wins INT DEFAULT 0,
    draws INT DEFAULT 0,
    losses INT DEFAULT 0,
    goals_for INT DEFAULT 0,
    goals_against INT DEFAULT 0,
    goal_difference INT DEFAULT 0,
    points INT DEFAULT 0,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

/* =========================
   TEAM SHEETS
========================= */
CREATE TABLE team_sheets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT,
    fixture_id INT,
    file_path VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id),
    FOREIGN KEY (fixture_id) REFERENCES fixtures(id)
);