const express = require('express');
const router = express.Router();

const { 
    getAllSensorData,
    getSensorData,
    getAllSensorIds,
    getSensorTD,
    updateSensorTD,
    getSensorLocation,
    updateSensorLocation,
    getLatestSensorData,
    insertSensorData,
    getAllSensorLocation
} = require('../controllers/sensors.controller');
const { verifyApiKey } = require('../middleware/verifyApiKey');

router.get('/data', verifyApiKey, getAllSensorData);
router.get('/:sensorId/data', verifyApiKey, getSensorData);
router.get('/ids', verifyApiKey, getAllSensorIds);
router.get('/:sensorId/td', verifyApiKey, getSensorTD);
router.put('/:sensorId/td', verifyApiKey, updateSensorTD);
router.get('/location', verifyApiKey, getAllSensorLocation);
router.get('/:sensorId/location', verifyApiKey, getSensorLocation);
router.put('/:sensorId/location', verifyApiKey, updateSensorLocation);
router.get('/latest', verifyApiKey, getLatestSensorData);
router.put('/:sensorId/data', verifyApiKey, insertSensorData);


module.exports = router;
