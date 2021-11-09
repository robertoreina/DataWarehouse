const companyModels = require('../models/company');
const { cityModels, countryModels, regionModels } = require('../models/region-country-city')


class Company {

    // get all Companies
    static async getAll(req, res) {

        try {

            const company = await companyModels.findAll(
                {
                    include: ['updater_user',
                        {
                            model: cityModels,
                            as: 'cities',
                            attributes:{
                                exclude:['country_id']
                            },
                            include:[
                                {
                                    model: countryModels,
                                    as: 'countries',
                                    attributes:{
                                        exclude:['region_id']
                                    },
                                    include:[
                                        {
                                            model: regionModels,
                                            as: 'regions'
                                        }
                                    ]
                                }
                            ]
                        }],
                    attributes: {
                        exclude: ['city_id', 'updater_userid']
                    }
                }
            );

            return res.status(200).json({
                status: 200,
                data: company,
                control: {
                    total_count: company.length
                }
            });

        } catch (error) {

            return res.status(error.status || 500).json({
                status: error.status || 500,
                error: error.message || "Internal server error"
            });
        }

    };

    // create new company
    static async create(req, res) {
        const { name, address, email, phone, city_id } = req.body;
        const updater_userid = req.user.user_id;

        try {

            if (!name) {
                throw { status: 422, message: 'El nombre de la compañia es requerido' };
            };

            if (!address) {
                throw { status: 422, message: 'La direccion es requerido' };
            };

            if (!email) {
                throw { status: 422, message: 'El email es requerido' };
            };

            if (!phone) {
                throw { status: 422, message: 'El telefono es requerido' };
            };

            if (!city_id) {
                throw { status: 422, message: 'Id de Ciudad es requerido' };
            };

            if (!updater_userid) {
                throw { status: 422, message: 'Id usuario actualizador es requerido' };
            };

            const company = await companyModels.create({
                name,
                email,
                address,
                phone,
                city_id,
                updater_userid
            });

            return res.status(201).json({
                status: 201,
                message: 'Compañia creada',
                data: { company_id: company.id }
            });

        } catch (error) {
            switch (error.name) {
                case 'SequelizeForeignKeyConstraintError':
                    error.message = 'El usuario o ciudad no existe';
                    error.status = 422;
                    break;

                default:
                    break;
            }
            return res.status(error.status || 500).json({
                status: error.status || 500,
                error: error.message || "Internal server error"
            });
        }
    };

    // delete company by id
    static async delete(req, res) {

        try {
            const company = await companyModels.destroy({
                where: {
                    id: req.params.company_id,
                }
            });

            if (!company) {
                throw { status: 404, message: 'Compañia no existe' };
            }

            return res.status(202).json({
                status: 202,
                message: 'Compañia eliminada'
            });

        } catch (error) {
            return res.status(error.status || 500).json({
                status: error.status || 500,
                error: error.message || "Internal server error"
            });
        }
    };

    // update company
    static async update(req, res) {
        const { name, address, email, phone, city_id } = req.body;
        const updater_userid = req.user.user_id;

        try {

            if (!name) {
                throw { status: 422, message: 'El nombre de la compañia es requerido' };
            };

            if (!email) {
                throw { status: 422, message: 'El email es requerido' };
            };

            if (!address) {
                throw { status: 422, message: 'La direccion es requerido' };
            };

            if (!phone) {
                throw { status: 422, message: 'El telefono es requerido' };
            };

            if (!city_id) {
                throw { status: 422, message: 'Id de Ciudad es requerido' };
            };

            if (!updater_userid) {
                throw { status: 422, message: 'Id usuario actualizador es requerido' };
            };

            const company = await companyModels.findOne({
                where: { id: req.params.company_id }
            });

            if (!company) {
                throw { status: 422, message: 'Compañia no existe' };
            }

            await company.update({
                name,
                address,
                email,
                phone,
                city_id,
                updater_userid
            },
                {
                    where: { id: req.params.company_id }
                });

            return res.status(202).json({
                status: 202,
                message: 'Compañia actualizada'
            });

        } catch (error) {
            switch (error.name) {
                case 'SequelizeForeignKeyConstraintError':
                    error.message = 'El usuario o no existe';
                    error.status = 422;
                    break;

                default:
                    break;
            }

            return res.status(error.status || 500).json({
                status: error.status || 500,
                error: error.message || "Internal server error"
            });
        }
    };

};

module.exports = Company;
