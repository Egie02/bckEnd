'use strict';

const express = require('express');
const dbControll = require('../controllers/dbControllers');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

//login (public route)
router.post('/profile/login', dbControll.loginEvent);

//protected routes
router.get('/profile/:PhoneNumber', authenticateToken, dbControll.getData);

// Update PIN route - add authenticateToken middleware and change :id to :PhoneNumber
router.put('/profile/auth/pin/:PhoneNumber', authenticateToken, dbControll.updatePIN);

module.exports = {
    routes: router
}