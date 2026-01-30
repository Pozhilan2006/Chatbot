const express = require('express');
const { handleParseIntent } = require('../controllers/intentController');

const router = express.Router();

router.post('/parse-intent', handleParseIntent);

module.exports = router;
