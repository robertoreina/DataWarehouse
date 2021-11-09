const express = require('express');
const CountryController = require('../controllers/Country');
const CityController = require('../controllers/City');


const api = express.Router();

// country post
api.post('/country', CountryController.create);

// get all country
api.get('/country', CountryController.getAll);

// get city by country
api.get('/country/:country_id/city', CityController.getByCountryId);

// delete country
api.delete('/country/:country_id', CountryController.delete);

// update country
api.put('/country/:country_id',  CountryController.update);

module.exports = api;