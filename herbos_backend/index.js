import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import mysql from 'mysql2/promise';
import crypto from 'crypto';

const PORT = 3100;
const REFRESH_SECRET = "ac62576998604bc5bd26a0177596238c2012915717a4727feeff2099f0fa48529924f08e3ff78c19af326ab94695dfd2f01e23f264f006ec9ef19179a4c2d84e";

const pool = mysql.createPool({
    host: 'db.jokeped.xyz',
    user: 'herbos',
    password: 'Scbm(UTNTbf!3KMw',
    database: 'herbos'
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: [
        'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use((req, res, next) => {
    let statusColor = res.statusCode >= 400 ? chalk.red : chalk.greenBright;
    console.log(`${chalk.blue('[INFO]')} [${new Date().toLocaleString()}] ${req.method} ${req.originalUrl} ${statusColor(res.statusCode)} ${req.ip}`);
    next();
});

const generateUserSecretKey = () => {
    return crypto.randomBytes(64).toString('hex');
};

app.post('/register', async (req, res) => {
    const userData = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

    try {
        const connection = await pool.getConnection();

        const [existingUser] = await connection.query('SELECT * FROM users WHERE username = ?', [userData.username]);
        if (existingUser.length > 0) {
            connection.release();
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const userSecretKey = generateUserSecretKey();

        await connection.query('INSERT INTO users (username, email, password, secret_key) VALUES (?, ?, ?, ?)', [userData.username, userData.email, hashedPassword, userSecretKey]);
        connection.release();

        res.json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post('/login', async (req, res) => {
    const userData = {
        username: req.body.username,
        password: req.body.password
    };

    try {
        const connection = await pool.getConnection();
        const [user] = await connection.query('SELECT * FROM users WHERE username = ?', [userData.username]);
        connection.release();

        if (user.length === 0) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const isMatch = await bcrypt.compare(userData.password, user[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const userSecretKey = user[0].secret_key;

        const accessToken = jwt.sign({ userId: user[0].id, username: userData.username }, userSecretKey, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ userId: user[0].id, username: userData.username }, REFRESH_SECRET, { expiresIn: "7d" });

        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });

        res.json({ accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const verifyToken = async (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) return res.status(403).json({ message: "Token required" });

    try {
        const decodedTemp = jwt.decode(token);
        if (!decodedTemp) return res.status(401).json({ message: "Invalid Token" });

        const connection = await pool.getConnection();
        const [user] = await connection.query('SELECT secret_key FROM users WHERE id = ?', [decodedTemp.userId]);
        connection.release();

        if (user.length === 0) return res.status(401).json({ message: "Invalid Token" });

        const userSecretKey = user[0].secret_key;

        const decoded = jwt.verify(token, userSecretKey);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid Token" });
    }
};

app.get('/profile', verifyToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [user] = await connection.query('SELECT id, username FROM users WHERE id = ?', [req.user.userId]);
        connection.release();

        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
});

try {
    console.clear();
    await pool.getConnection();
    console.log(`${chalk.blue('[INFO]')} [${new Date().toLocaleString()}] Database connected`);
    app.listen(PORT, () => {
        console.log(`${chalk.blue('[INFO]')} [${new Date().toLocaleString()}] Server is running on port ${chalk.greenBright(PORT)}`);
        pool.releaseConnection();
    });
} catch (error) {
    console.log(chalk.red(error));
    process.exit(1);
}