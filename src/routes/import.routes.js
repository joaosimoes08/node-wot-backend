const express = require('express');
const { verifyApiKey } = require('../middleware/verifyApiKey');
const { importCollection } = require('../controllers/import.controller');

const router = express.Router();

router.post('/:collection', verifyApiKey, importCollection);

module.exports = router;
