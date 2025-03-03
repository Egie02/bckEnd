'use strict'

const express = require('express');
const config = require('./config');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbRoutes = require('./routes/dbRoutes');

const allowedOrigins = process.env.NODE_ENV || 'http://localhost:8080'; // Production URL

const corsOptions = {
  origin: allowedOrigins ,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  optionsSuccessStatus: 200
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', dbRoutes.routes);

app.listen(config.port, () => {
  console.log('app listening on url ' + config.url)
});

