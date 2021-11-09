const express = require('express');
const ContactController = require('../controllers/Contact');
const verifyContact = require('../middlewares/verifyContact');


const api = express.Router();

//  Create Contact
api.post('/contact', verifyContact, ContactController.post);

// contact get all
api.get('/contact', ContactController.getAll);

// search contact 
api.get('/contact/search', ContactController.search);

// contact update
api.put('/contact/:id', verifyContact, ContactController.update);

// contact delete
api.delete('/contact/:id',  ContactController.delete);


module.exports = api;