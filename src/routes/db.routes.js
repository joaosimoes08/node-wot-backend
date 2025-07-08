const express = require('express');
const router = express.Router();
const { verifyApiKey } = require('../middleware/verifyApiKey');
const { getAllCollections, getCollectionData, updateCollectionData, deleteData } = require('../controllers/db.controller');

router.get('/collections', verifyApiKey, getAllCollections);
router.get('/collections/:name', verifyApiKey, getCollectionData);
router.put('/collections/:name', verifyApiKey, updateCollectionData);
router.delete('/collections/:name/:id', verifyApiKey, deleteData);


module.exports = router;