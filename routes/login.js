const express = require('express');
const {login} = require('../controllers/login')

const api = express.Router();

// Login user
api.post('/login', login);


module.exports = api;