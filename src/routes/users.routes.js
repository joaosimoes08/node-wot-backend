const express = require('express');
const router = express.Router();
const { verifyApiKey } = require('../middleware/verifyApiKey');
const { getAllUsers, updateUserRole } = require('../controllers/users.controller');

router.get('/', verifyApiKey, getAllUsers);
router.put('/:id/role', verifyApiKey, updateUserRole);

module.exports = router;