const express = require('express');
const router = express.Router();
const { login } = require('../controllers/autenticacion.controller');

router.post('/login', login);

module.exports = router;
