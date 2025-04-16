'use strict';

const dbData = require('../data/db');

const loginEvent = async (req, res, next) => {
    try {
        const { PhoneNumber, PIN } = req.body;
        const result = await dbData.loginEvent(PhoneNumber, PIN);
        res.send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const getData = async (req, res, next) => {
    try {
        const requestedPhoneNumber = req.params.PhoneNumber;
        
        // Check if user is trying to access their own data
        if (req.user.phoneNumber !== requestedPhoneNumber) {
            return res.status(403).json({ 
                success: false, 
                message: 'You can only access your own data' 
            });
        }

        const data = await dbData.getDataById(requestedPhoneNumber);
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Update Handler
const updatehandler = async (req, res, next, updateFunction) => {
    try {
        const dataId = req.params.id;
        const data = req.body;

        if (!dataId) {
            return res.status(400).json({
                success: false,
                message: "Missing required parameter: ID is mandatory.",
            });
        }

        console.log(`Updating data with ID: ${dataId}`);
        console.log("Update data:", data);

        const updatedData = await updateFunction(dataId, data);

        if (!updatedData || updatedData.length === 0) {
            console.log(`No record found with ID: ${dataId}`);
            return res.status(404).json({
                success: false,
                message: `Record with ID ${dataId} not found.`,
            });
        }

        console.log("Data updated successfully:", updatedData);
        return res.status(200).json({
            success: true,
            message: "Data updated successfully",
            data: updatedData[0],
        });
    } catch (error) {
        console.error(`Error updating data with ID ${req.params.id}:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Error updating data",
            error: error.message,
        });
    }
};

const updatePIN = async (req, res, next) => {
    try {
        const phoneNumber = req.params.PhoneNumber;
        const data = req.body;

        // Check if user is trying to update their own PIN
        if (req.user.phoneNumber !== phoneNumber) {
            return res.status(403).json({ 
                success: false, 
                message: 'You can only update your own PIN' 
            });
        }

        const result = await dbData.updatePIN(phoneNumber, data);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error updating PIN:', error.message);
        return res.status(500).json({
            success: false,
            message: "Error updating PIN",
            error: error.message,
        });
    }
};

module.exports = {
    loginEvent,
    getData,
    updatePIN
} 