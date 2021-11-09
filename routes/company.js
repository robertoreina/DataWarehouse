const express = require('express');
const CompanyController = require('../controllers/Company');

const api = express.Router();

// create company
api.post('/company',  CompanyController.create);

// get all company
api.get('/company',  CompanyController.getAll);

// get all company
api.get('/company/search',  (req, res) =>{
    
    const id = req.query.id;

    const name = req.query.name;
    return res.status(200).json({
        status: 200,
        message: 'Compañia encontrada',
        data: { id, name}
    });
});


// delete company
api.delete('/company/:company_id',  CompanyController.delete);

// update company
api.put('/company/:company_id',  CompanyController.update);


module.exports = api;