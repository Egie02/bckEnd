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


const updatePIN = async (PhoneNumber, PINdata) => {
    try {
        console.log('Starting PIN update for phone number:', PhoneNumber);
        console.log('PIN update data:', { ...PINdata, newPIN: '[REDACTED]', oldPIN: '[REDACTED]' });

        // Validate phone number
        if (!PhoneNumber) {
            console.log('PIN update failed: Phone number missing');
            return { success: false, message: 'Phone number is required' };
        }

        // First, get the user's current PIN from database
        console.log('Fetching current user PIN from database');
        const user = (await executeQuery('getPINByPhone', [
            { name: 'PhoneNumber', type: sql.NVarChar(50), value: PhoneNumber }
        ]))[0];

        if (!user) {
            console.log('PIN update failed: User not found');
            return { success: false, message: 'User not found' };
        }
        console.log('Found user record');

        // For one-time PIN change (first login), skip old PIN verification
        if (PINdata.isFirstTime) {
            console.log('Processing first-time PIN setup');
            if (!PINdata.newPIN) {
                console.log('First-time PIN setup failed: New PIN missing');
                return { success: false, message: 'New PIN is required' };
            }

            const newPIN = String(PINdata.newPIN);
            console.log('Hashing new PIN');
            const hashedNewPIN = await bcrypt.hash(newPIN, 10);
            
            console.log('Updating PIN in database');
            await executeQuery('updatePIN', [
                { name: 'PhoneNumber', type: sql.NVarChar(50), value: PhoneNumber },
                { name: 'PIN', type: sql.NVarChar(255), value: hashedNewPIN },
            ]);

            console.log('First-time PIN setup successful');
            return { success: true, message: 'PIN set successfully' };
        }

        // Regular PIN change flow
        console.log('Processing regular PIN change');
        const oldPIN = String(PINdata.oldPIN);
        
        console.log('Old PIN:', oldPIN);
        // Compare hashed PINs
        console.log('Verifying current PIN');
        const isOldPinValid = await bcrypt.compare(oldPIN, user.PIN);
        if (!isOldPinValid) {
            console.log('PIN update failed: Current PIN verification failed');
            return { success: false, message: 'Current PIN is incorrect' };
        }
        console.log('Current PIN verified successfully');

        if (!PINdata.newPIN) {
            console.log('PIN update failed: New PIN missing');
            return { success: false, message: 'New PIN is required' };
        }

        const newPIN = String(PINdata.newPIN);
        console.log('Hashing new PIN');
        const hashedNewPIN = await bcrypt.hash(newPIN, 10);
        
        console.log('Updating PIN in database');
        await executeQuery('updatePIN', [
            { name: 'PhoneNumber', type: sql.NVarChar(50), value: PhoneNumber },
            { name: 'PIN', type: sql.NVarChar(255), value: hashedNewPIN },
        ]);

        console.log('PIN update successful');
        return { success: true, message: 'PIN updated successfully' };
    } catch (error) {
        console.error('Error updating PIN:', error.message);
        console.error('Error stack:', error.stack);
        return { success: false, message: 'An error occurred while updating PIN' };
    }
};



module.exports = {
    loginEvent,
    getDataById,
    updatePIN
}
