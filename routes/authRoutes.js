const { signin } = require('../controllers/auth');
const express = require('express');
const router = express.Router();
const { signinValidator } = require('../schema/auth');

router.post('/login', signinValidator, signin);

module.exports = router;
