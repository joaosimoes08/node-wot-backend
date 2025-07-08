const express = require('express');
const { verifyApiKey } = require('../middleware/verifyApiKey');
const {
  getLogs,
  deleteLogs,
  exportLogs
} = require('../controllers/logs.controller');

const router = express.Router();

router.get('/', verifyApiKey, getLogs);
router.delete('/', verifyApiKey, deleteLogs);
router.get('/export', verifyApiKey, exportLogs);

module.exports = router;
