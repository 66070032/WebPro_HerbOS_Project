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

try {
    console.clear();
    await pool.getConnection();
    console.log(`${chalk.blue('[INFO]')} [${new Date().toLocaleString()}] Database connected`);
    app.listen(3100, () => {
        console.log(`${chalk.blue('[INFO]')} [${new Date().toLocaleString()}] Server is running on port ${chalk.greenBright('3000')}`);
        pool.releaseConnection();
    })
} catch (error) {
    console.log(chalk.red(error));
    process.exit(1);
}