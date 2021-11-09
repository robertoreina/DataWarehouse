const usersModels = require('../models/user');
// const { Op } = require('sequelize');


async function verifyUser(req, res, next) {
    try {
        const { email, first_name, last_name, password } = req.body;

        console.log(req.body);

        if (!email && req.route.methods.post) {
            throw { status: 422, message: 'El Email es obligatorio' };
        };


        if (!first_name) {
            throw { status: 422, message: 'El Nombre es obligatorio' };
        }

        if (!last_name) {
            throw { status: 422, message: 'El apelido es obligatorio' };
        }

        // if (password.length < 8) {
        //     throw { status: 422, message: 'Password has to be bigger than 6 characters' };
        // }

        // if (req.route.path != '/user') {
        //     return next();
        // }

        if (req.route.methods.post) {

            if (!password) {
                throw { status: 422, message: 'La contraseña es obligatoria' };
            }    

            const users = await usersModels.findAll(
                {
                    where: {
                        email
                    }
                }
            );

            if (users.length > 0) {
                throw { status: 409, message: 'El email ya existe registrado'};
            };
        }
        next();

    } catch (error) {
        return res.status(error.status || 500).json({
            status: error.status || 500,
            error: error.message || "Internal server error"
        });
    }
}

module.exports = { verifyUser };