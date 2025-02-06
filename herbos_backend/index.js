import express from 'express';

const serv = new express();

serv.get('/', (req, res) => {
    res.status(200).json({
        message: 'Hello World'
    });
});

serv.listen(3100, () => {
    console.log('Server running on port 3100');
});