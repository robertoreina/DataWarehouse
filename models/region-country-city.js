const {DataTypes} = require('sequelize');
const connection = require('../connection');
// const countryModels = require('./country');

//Region Model
const regionModels = connection.define(
    'regions',
    {  
        name:{
            type: DataTypes.STRING
        }
    },
    {timestamps: false}  
);

//Country Model
const countryModels = connection.define(
    'country',
    {  
        name:{
            type: DataTypes.STRING
        },
        region_id:{
            type: DataTypes.INTEGER
        }
    },
    {timestamps: false}  
);

// City model
const cityModels = connection.define(
    'cities',
    {  
        name:{
            type: DataTypes.STRING
        },
        country_id:{
            type: DataTypes.INTEGER
        }
    },
    {timestamps: false}  
);


regionModels.hasMany(countryModels, {as: 'country', foreignKey: 'region_id'});
countryModels.belongsTo(regionModels, {as: 'regions', foreignKey: 'region_id'});
countryModels.hasMany(cityModels, {as: 'cities', foreignKey: 'country_id'});
cityModels.belongsTo(countryModels, {as: 'countries', foreignKey: 'country_id'});


// model.hasMany(countryModels);

module.exports = {regionModels, countryModels, cityModels};
