'use strict'

const express = require('express');
const config = require('./config');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbRoutes = require('./routes/dbRoutes');

// Allow access from web clients
const allowedOrigins = [
  'http://localhost:8080',
  process.env.NODE_ENV === 'development' ? '*' : process.env.NODE_ENV,
  // Add your production domain when ready
  // 'https://your-production-domain.com'
];

const corsOptions = {
  origin: function(origin, callback) {
    // In development, allow all origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // Allow requests with no origin (like mobile apps)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
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

