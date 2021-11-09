const express = require('express');
const UserController = require('../controllers/User');
const {verifyUser} = require('../middlewares/verifyUser');
const adminValidation = require('../middlewares/adminValidation');
const userValidation = require('../middlewares/userValidation');

const api = express.Router();

// create user
api.post('/user', adminValidation, verifyUser, UserController.post);

// get all user
api.get('/user',  adminValidation, UserController.getAll);

// get user by id
api.get('/user/:user_id', userValidation, UserController.getById);

// delete user
api.delete('/user/:user_id', adminValidation, UserController.delete);

// update user
api.put('/user/:user_id', adminValidation, verifyUser, UserController.update);


module.exports = api;