// const regionModels = require('../models/region-country-city');
const {countryModels, regionModels} = require('../models/region-country-city');

class Country {

    // get all Country
    static async getAll(req, res) {

        try {

            const country = await countryModels.findAll(
                {
                    include:[{model: regionModels, as: 'regions'}],
                    attributes: {
                        exclude: ['region_id']
                    }
                }
            );

            return res.status(200).json({
                status: 200,
                data: country,
                control: {
                    total_count: country.length
                }
            });

        } catch (error) {

            return res.status(error.status || 500).json({
                status: error.status || 500,
                error: error.message || "Internal server error"
            });
        }

    };

    // get Country by Region id
    static async getByRegionId(req, res) {

        try {

            const country = await countryModels.findAll(
                {
                    where: {
                        region_id: req.params.region_id
                    },
                    include:[{model: regionModels, as: 'regions'}],
                    attributes: {
                        exclude: ['region_id']
                    }
                }
            );

            return res.status(200).json({
                status: 200,
                data: country,
                control: {
                    total_count: country.length
                }
            });

        } catch (error) {

            return res.status(error.status || 500).json({
                status: error.status || 500,
                error: error.message || "Internal server error"
            });
        }

    };

    // create new country
    static async create(req, res) {
        const { name, region_id } = req.body;

        try {

            if (!name) {
                throw { status: 422, message: 'El nombre del pais es requerido' };
            };

            if (!region_id) {
                throw { status: 422, message: 'El id de la region es requerido' };
            };

            const country = await countryModels.create({
                name,
                region_id
            });

            return res.status(201).json({
                status: 201,
                message: 'Pais creado',
                data: { country_id: country.id }
            });

        } catch (error) {
            switch (error.name) {
                case 'SequelizeForeignKeyConstraintError':
                    error.message = 'La region no existe';
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

    // delete country by id
    static async delete(req, res) {

        try {
            const country = await countryModels.destroy({
                where: {
                    id: req.params.country_id,
                }
            });

            if (!country) {
                throw { status: 404, message: 'Pais no existe' };
            }

            return res.status(202).json({
                status: 202,
                message: 'Pais eliminado'
            });

        } catch (error) {
            console.log(error)
            return res.status(error.status || 500).json({
                status: error.status || 500,
                error: error.message || "Internal server error"
            });
        }
    };

    // update country
    static async update(req, res) {
        const { name, region_id } = req.body;

        try {

            if (!name) {
                throw { status: 422, message: 'El nombre del pais es requerido' };
            };

            if (!region_id) {
                throw { status: 422, message: 'El id de la region es requerido' };
            };

            const country = await countryModels.findOne({
                where: { id: req.params.country_id }
            });

            if (!country) {
                throw { status: 422, message: 'Pais no existe' };
            }

            await countryModels.update({
                name,
                region_id
            },
                {
                    where: { id: req.params.country_id }
                });

            return res.status(202).json({
                status: 202,
                message: 'Pais actualizado'
            });

        } catch (error) {
            switch (error.name) {
                case 'SequelizeForeignKeyConstraintError':
                    error.message = 'La region no existe';
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

}

module.exports = Country;
