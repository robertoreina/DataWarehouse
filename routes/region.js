const express = require('express');
const RegionController = require('../controllers/Region');
const CountryController = require('../controllers/Country');


const api = express.Router();

// region post
api.post('/region', RegionController.create);

// get all region
api.get('/region', RegionController.getAll);

// get country by region
api.get('/region/:region_id/country', CountryController.getByRegionId);

// delete region
api.delete('/region/:region_id', RegionController.delete);

// update region
api.put('/region/:region_id',  RegionController.update);

module.exports = api;