import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
    host: 'jokeped.xyz:3306',
    user: 'funweb',
    password: 'funweb123!',
    database: 'funweb'
});

// const [rows] = await connection.execute('SELECT * FROM users');
// console.log(rows);

// await connection.end();

module.exports = connection;