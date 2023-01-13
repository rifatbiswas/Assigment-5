

const express = require('express');
const {readdirSync} = require('fs');
const app = express();
require('dotenv').config();

//middleware require
const hpp = require('hpp');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const xss = require('xss-clean');
const rateLimite = require('express-rate-limit');
const sanitize = require('express-mongo-sanitize');

//secrute middleware
app.use(express.json());
app.use(helmet());
app.use(hpp());
app.use(cors());
app.use(xss());
app.use(sanitize());
app.use(morgan('dev'));

//modobd model
const mongoose = require('mongoose');

//route limiter
const limiter = rateLimite({
    windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
});
app.use(limiter);

//handel router
readdirSync('./routes/').map((file) =>{
    app.use('/api/v2/', require(`./routes/${file}`));
});

//undefind router
app.use('*',(req,res) => {
    res.status(404).send('This is Rong Router');
});

//Database conected
mongoose.connect(process.env.URL)
        .then((value) =>{
            console.log('Database Connected');
        })
        .catch((err) => {
            console.log(err);
        });

//module exporte
module.exports = app;  