const usersModels = require('../models/user');

class User {

    // get all user 
    static async getAll(req, res) {

        try {
            const users = await usersModels.findAll(
                {
                    attributes: {
                        exclude: ['password']
                    }
                }
            );

            return res.status(200).json({
                status: 200,
                data: users,
                control: {
                    total_count: users.length
                }
            });
        } catch (error) {
            return res.status(error.status || 500).json({
                status: error.status || 500,
                error: error.message || "Internal server error"
            });
        }

    };

    // get user by id 
    static async getById(req, res) {

        try {
            const users = await usersModels.findOne({
                where: {
                    id: req.params.user_id
                },
                attributes: {
                    exclude: ['password']
                }
            });

            if (!users) {
                return res.status(404).json({
                    status: 404,
                    message: 'user_id not found'
                });
            }

            return res.status(200).json({
                status: 200,
                data: users
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                error: error.message
            })
        }

    };

    // insert new user
    static async post(req, res) {
        const { email, first_name, last_name, password, is_admin } = req.body;

        const users = await usersModels.findOne({
            where: {
                email
            }
        });

        if (users) {
            throw { status: 409, message: 'Email ya se encuentra registrado' };
        }

        try {
            const userCreated = await usersModels.create({
                email,
                first_name,
                last_name,
                password,
                is_admin
            });

            return res.status(201).json({
                status: 201,
                message: 'user created',
                data: { user_id: userCreated.id }
            });

        } catch (error) {
            return res.status(error.status || 500).json({
                status: error.status || 500,
                error: error.message || "Internal server error"
            });
        }
    };

    // delete user
    static async delete(req, res) {

        try {
            const user = await usersModels.destroy({
                where: {
                    id: req.params.user_id
                }
            });

            if (!user) {
                throw { status: 404, message: 'user not found' };
            }

            return res.status(202).json({
                status: 202,
                message: 'user removed'
            });

        } catch (error) {
            return res.status(error.status || 500).json({
                status: error.status || 500,
                error: error.message || "Internal server error"
            });
        }
    };

    // update user
    static async update(req, res) {
        const {first_name, last_name, password, is_admin } = req.body;

        try {

            const user = await usersModels.findOne({
                where: { id: req.params.user_id }
            });

            if (!user) {
                throw { status: 404, message: 'user not found' };
            }

            await usersModels.update({
                first_name,
                last_name,
                password,
                is_admin
            },
                {
                    where: { id: req.params.user_id }
                });

            return res.status(202).json({
                status: 202,
                message: 'user update'
            });

        } catch (error) {

            return res.status(error.status || 500).json({
                status: error.status || 500,
                error: error.message || "Internal server error"
            });
        }
    };
}

module.exports = User;
