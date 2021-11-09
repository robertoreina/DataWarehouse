const {DataTypes} = require('sequelize');
const connection = require('../connection');
const bcrypt = require('bcryptjs');


const model = connection.define(
    'users',
    {  
        email: {
            type: DataTypes.STRING
        },
        first_name: {
            type: DataTypes.STRING
        },
        last_name: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING,
            get(){
                const rawValue = this.getDataValue('password');
                return rawValue;
            },
            set(value){
                const salt = bcrypt.genSaltSync(10);
                this.setDataValue('password', bcrypt.hashSync(value, salt));
            }
        },
        is_admin: {
            type: DataTypes.BOOLEAN
        }
    },
    {timestamps: false}  
);

module.exports = model;