const { DataTypes } = require('sequelize');
const connection = require('../connection');
const contactModels = require('./contact');
const contactChanelModels = require('./contact_chanels');
const preferenceModels = require('./preferences');

const model = connection.define(
    'contact_has_chanels',
    {
        contact_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        contact_chanel_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        user_account: {
            type: DataTypes.STRING
        },
        preference_id: {
            type: DataTypes.INTEGER
        }
    },
    { timestamps: false }
);

// model.belongsTo(contactModels, { as: 'contacts', foreignKey: 'contact_id' });
model.belongsTo(contactChanelModels, { as: 'contact_chanels', foreignKey: 'contact_chanel_id' });
model.belongsTo(preferenceModels, { as: 'preferences', foreignKey: 'preference_id' });
module.exports = model;
