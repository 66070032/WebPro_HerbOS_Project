import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import mysql from 'mysql2/promise';

const PORT = 3100;

const pool = mysql.createPool({
    host: 'db.jokeped.xyz',
    user: 'herbos',
    password: 'Scbm(UTNTbf!3KMw',
    database: 'herbos'
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.get('/', (req, res) => {
    res.send("HerbOS Backend API");
});

app.get('/users', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        connection.release();
    }
});

try {
    console.clear();
    await pool.getConnection();
    console.log(`${chalk.blue('[INFO]')} [${new Date().toLocaleString()}] Database connected`);
    app.listen(PORT, () => {
        console.log(`${chalk.blue('[INFO]')} [${new Date().toLocaleString()}] Server is running on port ${chalk.greenBright(PORT)}`);
        pool.releaseConnection();
    })
} catch (error) {
    console.log(chalk.red(error));
    process.exit(1);
}