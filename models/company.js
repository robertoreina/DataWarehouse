const {DataTypes} = require('sequelize');
const connection = require('../connection');
const { cityModels } = require('./region-country-city');
const userModels = require('./user');


const model = connection.define(
    'companies',
    {  
        name: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING
        },
        city_id: {
            type: DataTypes.INTEGER
        },
        updater_userid: {
            type: DataTypes.INTEGER
        }
    },
    {timestamps: false}  
);

model.belongsTo(cityModels, {as: 'cities', foreignKey: 'city_id'});
model.belongsTo(userModels, {as: 'updater_user', foreignKey: 'updater_userid'});


module.exports = model;