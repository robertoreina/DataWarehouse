const config = require('../config');
const usersModels = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function login(req, res) {
    const { email, password } = req.body;

    try {

        if (!email || !password) {
            throw { status: 401, message: 'Email o contraseña invalidos' };
        };

        const users = await usersModels.findOne(
            {
                where: { email }
            }
        );

        if (!users) {
            throw { status: 401, message: 'Email o contraseña invalidos' };
        };

        if (config.user_admin != email ) {
            const match = bcrypt.compareSync(password, users.password);
            if (!match) {
                throw { status: 401, message: 'Email o contraseña invalidos' };
            };          
        }else{
            if (users.password != password) {
                throw { status: 401, message: 'Email o contraseña invalidos' };
            }
        }


        const token = jwt.sign({
            user: {
                user_id: users.id,
                is_admin: users.is_admin
            }
        }, config.jwt_secret);

        const data = {
            id: users.id,
            email: users.email,
            first_name: users.first_name,
            last_name: users.last_name,
            is_admin: users.is_admin
        };

        return res.json({
            status: 200,
            token: token,
            data: data
        });

    } catch (error) {
        return res.status(error.status || 500).json({
            status: error.status || 500,
            error: error.message || "Internal server error"
        });
    };

};

module.exports = { login };
