'use strict';

const express = require('express');
const dbControll = require('../controllers/dbControllers');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

//login (public route)
router.post('/profile/login', dbControll.loginEvent);

//protected routes
router.get('/profile/:PhoneNumber', authenticateToken, dbControll.getData);


module.exports = {
    routes: router
}
