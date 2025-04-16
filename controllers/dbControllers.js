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


module.exports = {
    loginEvent,
    getData,

} 
