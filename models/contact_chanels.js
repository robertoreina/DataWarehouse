const {DataTypes} = require('sequelize');
const connection = require('../connection');

const model = connection.define(
    'contact_chanels',
    {  
        name: {
            type: DataTypes.STRING
        }
    },
    {timestamps: false}  
);

module.exports = model;