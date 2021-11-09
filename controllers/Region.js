const {regionModels, countryModels, cityModels} = require('../models/region-country-city');
// const {countryModels} = require('../models/country');


class Region {

    // get all Region
    static async getAll(req, res) {

        try {

            const region = await regionModels.findAll({
                include:[{
                    model: countryModels,
                    as: 'country',
                    include:[
                        {
                            model: cityModels,
                            as:'cities'
                        }
                    ]
                }]
            });

            return res.status(200).json({
                status: 200,
                data: region,
                control: {
                    total_count: region.length
                }
            });

        } catch (error) {

            return res.status(error.status || 500).json({
                status: error.status || 500,
                error: error.message || "Internal server error"
            });
        }

    };

    // create new region
    static async create(req, res) {
        const { name } = req.body;

        try {

            if (!name) {
                throw { status: 422, message: 'El nombre de la region es requerido' };
            };

            const region = await regionModels.create({
                name
            });

            return res.status(201).json({
                status: 201,
                message: 'Region Creada',
                data: { region_id: region.id }
            });

        } catch (error) {
            return res.status(error.status || 500).json({
                status: error.status || 500,
                error: error.message || "Internal server error"
            });
        }
    };

    // delete Region by id
    static async delete(req, res) {

        try {
            const region = await regionModels.destroy({
                where: {
                    id: req.params.region_id,
                }
            });

            if (!region) {
                throw { status: 404, message: 'Region no existe' };
            }

            return res.status(202).json({
                status: 202,
                message: 'Region eliminada'
            });

        } catch (error) {
            return res.status(error.status || 500).json({
                status: error.status || 500,
                error: error.message || "Internal server error"
            });
        }
    };

    // update region
    static async update(req, res) {
        const { name } = req.body;

        try {

            if (!name) {
                throw { status: 422, message: 'El nombre de la region es requerido' };
            };

            const region = await regionModels.findOne({
                where: { id: req.params.region_id }
            });

            if (!region) {
                throw { status: 404, message: 'Region no existe' };
            }

            await regionModels.update({
                name
            },
                {
                    where: { id: req.params.region_id }
                });

            return res.status(202).json({
                status: 202,
                message: 'Region actualizada'
            });

        } catch (error) {

            return res.status(error.status || 500).json({
                status: error.status || 500,
                error: error.message || "Internal server error"
            });
        }
    };

}

module.exports = Region;
