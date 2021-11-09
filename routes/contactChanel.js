const express = require('express');
const ContactChanelController = require('../controllers/ContactChanel');

const api = express.Router();

// get all contact chanel
api.get('/contact-chanel', ContactChanelController.getAll);

module.exports = api;