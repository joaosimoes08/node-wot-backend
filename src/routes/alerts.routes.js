const express = require('express');
const router = express.Router();
const { verifyApiKey } = require('../middleware/verifyApiKey');
const { createAlert, getAllAlerts, deleteAlert } = require('../controllers/alerts.controller');

router.post('/', verifyApiKey, createAlert);
router.get('/', verifyApiKey, getAllAlerts);
router.delete('/:id', verifyApiKey, deleteAlert);

module.exports = router;