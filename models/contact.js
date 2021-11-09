const {DataTypes} = require('sequelize');
const connection = require('../connection');
const { cityModels } = require('./region-country-city');
const userModels = require('./user');
const companyModels = require('./company');
const contact_has_chanelModels = require('./contact_has_chanels');


const model = connection.define(
    'contacts',
    {  
        first_name: {
            type: DataTypes.STRING
        },
        last_name: {
            type: DataTypes.STRING
        },
        job: {
            type: DataTypes.STRING
        },
        company_id:{
            type: DataTypes.INTEGER
        },
        email: {
            type: DataTypes.STRING
        },
        city_id:{
            type: DataTypes.INTEGER
        },
        address: {
            type: DataTypes.STRING
        },
        interes:{
            type: DataTypes.INTEGER
        },
        pixel: {
            type: DataTypes.BLOB
        },
        updater_userid: {
            type: DataTypes.INTEGER
        }
    },
    {timestamps: false}  
);

model.belongsTo(cityModels, {as: 'cities', foreignKey: 'city_id'});
model.belongsTo(companyModels, {as: 'companies', foreignKey: 'company_id'});

model.belongsTo(userModels, {as: 'updater_user', foreignKey: 'updater_userid'});
model.hasMany(contact_has_chanelModels, {as: 'contact_has_chanels', foreignKey: 'contact_id'});
module.exports = model;
