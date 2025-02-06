import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';

let config = process.env;

const app = new express();
app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
));

const generateString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const delay = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let db;
async function connection() {
    try {
        db = await mysql.createConnection({
            host: 'jokeped.xyz',
            port: 3306,
            user: 'funweb',
            password: 'funweb123!',
            database: 'funweb'
        });

        await delay(500);
        console.clear();
        console.log(`${chalk.blue('[INFO]')} Database connect ${chalk.green('successfully')}`);

        app.listen(config.API_PORT, () => {
            console.log(`${chalk.blue('[INFO]')} API Server locate at ${chalk.green(`http://localhost:${config.API_PORT}`)}`);
        });

        return db;
    } catch (error) {
        console.log(error);
    }
}
connection();

app.get('/', async (req, res) => {
    const [row, fields] = await db.execute('SELECT * FROM users');
    console.log("Enter.")
    res.send(row);
});

app.get("/set-cookie", (req, res) => {
    res.cookie("username", "JohnDoe", { maxAge: 900000, httpOnly: true, secure: true, sameSite: "None", });
    res.send("Cookie ถูกตั้งค่าแล้ว");
});

app.get("/get-cookie", (req, res) => {
    const username = req.cookies.username;
    res.send(`ค่าของ cookie: ${username}`);
});

app.get("/delete-cookie", (req, res) => {
    res.clearCookie("username");
    res.send("Cookie ถูกลบแล้ว");
});