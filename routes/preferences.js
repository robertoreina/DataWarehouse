const express = require('express');
const preferenceController = require('../controllers/Preference');

const api = express.Router();

// get all contact chanel
api.get('/preference', preferenceController.getAll);

module.exports = api;