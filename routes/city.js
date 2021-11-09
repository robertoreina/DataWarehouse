const express = require('express');
const CityController = require('../controllers/City');


const api = express.Router();

// city post
api.post('/city', CityController.create);

// get all city
api.get('/city', CityController.getAll);

// delete city
api.delete('/city/:city_id', CityController.delete);

// update city
api.put('/city/:city_id',  CityController.update);

module.exports = api;