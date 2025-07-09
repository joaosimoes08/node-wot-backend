const express = require('express');
const router = express.Router();
const { verifyApiKey } = require('../middleware/verifyApiKey');
const { openBuffet, closeBuffet, getCurrentData } = require('../controllers/wot.controller');

router.post('/openBuffet', verifyApiKey, openBuffet);
router.post('/closeBuffet', verifyApiKey, closeBuffet);
router.get('/getCurrentData', verifyApiKey, getCurrentData);



module.exports = router;