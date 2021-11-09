// const cityModels = require('../models/city');
// const countryModels = require('../models/country');
const {countryModels, cityModels} = require('../models/region-country-city');


class City {

    // get all City
    static async getAll(req, res) {

        try {

            const city = await cityModels.findAll(
                {
                    include:[{model: countryModels, as: 'countries'}],
                    attributes: {
                        exclude: ['country_id']
                    }
                }
            );

            return res.status(200).json({
                status: 200,
                data: city,
                control: {
                    total_count: city.length
                }
            });

        } catch (error) {

            return res.status(error.status || 500).json({
                status: error.status || 500,
                error: error.message || "Internal server error"
            });
        }

    };

    // get City by Country id
    static async getByCountryId(req, res) {

        try {

            const city = await cityModels.findAll(
                {
                    where: {
                        country_id: req.params.country_id
                    },
                    include:[{model: countryModels, as: 'countries'}],
                    attributes: {
                        exclude: ['country_id']
                    }
                }
            );

            return res.status(200).json({
                status: 200,
                data: city,
                control: {
                    total_count: city.length
                }
            });

        } catch (error) {

            return res.status(error.status || 500).json({
                status: error.status || 500,
                error: error.message || "Internal server error"
            });
        }

    };

    // create new city
    static async create(req, res) {
        const { name, country_id } = req.body;

        try {

            if (!name) {
                throw { status: 422, message: 'El nombre de la ciudad es requerido' };
            };

            if (!country_id) {
                throw { status: 422, message: 'El id del pais es requerido' };
            };

            const city = await cityModels.create({
                name,
                country_id
            });

            return res.status(201).json({
                status: 201,
                message: 'Ciudad creada',
                data: { city_id: city.id }
            });

        } catch (error) {
            switch (error.name) {
                case 'SequelizeForeignKeyConstraintError':
                    error.message = 'El pais no existe';
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

    // delete city by id
    static async delete(req, res) {

        try {
            const city = await cityModels.destroy({
                where: {
                    id: req.params.city_id,
                }
            });

            if (!city) {
                throw { status: 404, message: 'Ciudad no existe' };
            }

            return res.status(202).json({
                status: 202,
                message: 'Ciudad eliminada'
            });

        } catch (error) {
            return res.status(error.status || 500).json({
                status: error.status || 500,
                error: error.message || "Internal server error"
            });
        }
    };

    // update city
    static async update(req, res) {
        const { name, country_id } = req.body;

        try {

            if (!name) {
                throw { status: 422, message: 'El nombre de la ciudad es requerido' };
            };

            if (!country_id) {
                throw { status: 422, message: 'El id del pais es requerido' };
            };

            const city = await cityModels.findOne({
                where: { id: req.params.city_id }
            });

            if (!city) {
                throw { status: 422, message: 'Ciudad no existe' };
            }

            await cityModels.update({
                name,
                country_id
            },
                {
                    where: { id: req.params.city_id }
                });

            return res.status(202).json({
                status: 202,
                message: 'Ciudad actualizada'
            });

        } catch (error) {
            switch (error.name) {
                case 'SequelizeForeignKeyConstraintError':
                    error.message = 'El pais no existe';
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

module.exports = City;
