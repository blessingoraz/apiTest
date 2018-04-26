const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const db = require('./config/db');
const PORT = 5000;

mongoose.connect(db.url);
const dbConn = mongoose.connection;

dbConn.once('open', () => {
    console.log('DB is connected');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// require('./api/routes/user')(app);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to my API'});
});
app.listen(PORT, () => {
    console.log('Listening to this port: ', PORT);
});

