const express = require('express');
const { verifyApiKey } = require('../middleware/verifyApiKey');
const { exportCollection } = require('../controllers/export.controller');

const router = express.Router();

router.get('/:collection', verifyApiKey, exportCollection);

module.exports = router;
