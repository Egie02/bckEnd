'use strict';
const utils = require('../utils');
const config = require('../../config');
const sql = require('mssql');
const bcrypt = require('bcrypt');    
const jwt = require('jsonwebtoken');
require('dotenv').config();

const executeQuery = async (queryName, inputs) => {
    try {
        let pool = await sql.connect(config.sql);
        const sqlQueries = await utils.loadSqlQueries('db');
        const request = pool.request();

        inputs.forEach(input => {
            request.input(input.name, input.type, input.value);
        });

        const result = await request.query(sqlQueries[queryName]);
        return result.recordset;
    } catch (error) {
        throw error;
    }
};

const loginEvent = async (PhoneNumber, PIN) => {
    try {
        const user = (await executeQuery('loginEvents', [
            { name: 'PhoneNumber', type: sql.NVarChar(255), value: PhoneNumber },
        ]))[0];

        if (!user) {
            return { success: false, message: 'User not found' };
        }

        const isPinValid = await bcrypt.compare(PIN, user.PIN);
        
        if (!isPinValid) {
            return { success: false, message: 'Incorrect PIN' };
        }

        if (user.AuthStatus !== 'enable') {
            return { success: false, message: 'Account is disabled' };
        }

        const sanitizedUser = { ...user };
        delete sanitizedUser.PIN;

        const token = jwt.sign(
            { phoneNumber: user.PhoneNumber, id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return { 
            success: true, 
            message: 'Login successful', 
            user: sanitizedUser,
            token: token
        };
    } catch (error) {
        return { success: false, message: 'An error occurred during login' };
    }
};

const getDataById = async(PhoneNumber) => {
    console.log('Getting data for phone number:', PhoneNumber);
    const result = await executeQuery('getbyId', [
        { name: 'PhoneNumber', type: sql.NVarChar(255), value: PhoneNumber },
    ]);
    console.log('Query result:', result);
    return result;
}    



module.exports = {
    loginEvent,
    getDataById
}
