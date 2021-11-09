const contactModels = require('../models/contact');
const contact_has_chanelModels = require('../models/contact_has_chanels');
const userModels = require('../models/user');
const { cityModels, countryModels, regionModels } = require('../models/region-country-city')
const companyModels = require('../models/company');
const preferenceModels = require('../models/preferences');
const contactChanelModels = require('../models/contact_chanels');
const { Op } = require("sequelize");
const { literal } = require("sequelize");



class Contact {

    // get all contact
    static async getAll(req, res) {


        try {
            const contacts = await contactModels.findAll(
                {
                    include: [
                        {
                            model: userModels,
                            as: 'updater_user',
                            attributes:
                            {
                                exclude: ['password']
                            }
                        },
                        {
                            model: companyModels,
                            as: 'companies',
                        },
                        {
                            model: cityModels,
                            as: 'cities',
                            attributes: {
                                exclude: ['country_id']
                            },
                            include: [
                                {
                                    model: countryModels,
                                    as: 'countries',
                                    attributes: {
                                        exclude: ['region_id']
                                    },
                                    include: [
                                        {
                                            model: regionModels,
                                            as: 'regions'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            model: contact_has_chanelModels,
                            as: 'contact_has_chanels',
                            include: [
                                {
                                    model: contactChanelModels,
                                    as: 'contact_chanels',
                                    attributes: ['name']
                                },
                                {
                                    model: preferenceModels,
                                    as: 'preferences',
                                    attributes: ['name']
                                },
                            ],
                            attributes:
                            {
                                exclude: ['contact_id']
                            }
                        },
                    ],
                    attributes: {
                        exclude: ['updater_userid', 'company_id', 'city_id']
                    }
                }
            );
            return res.status(200).json({
                status: 200,
                data: contacts,
                control: {
                    total_count: contacts.length
                }
            });

        } catch (error) {
            return res.status(500).json({
                status: 500,
                error: error.message
            })
        }
    };

    // Insert new Contact
    static async post(req, res) {
        const { first_name, last_name, job, company_id, email, city_id, address, interes, pixel } = req.body;
        const { contact_chanels } = req.body
        const updater_userid = req.user.user_id;

        try {
            const contact = await contactModels.create({
                first_name,
                last_name,
                job,
                company_id,
                email,
                city_id,
                address,
                interes,
                pixel,
                updater_userid
            });

            if (contact_chanels) {
                const contact_id = contact.id;
                contact_chanels.forEach((chanel) => {
                    chanel.contact_id = contact_id;
                });

                const contactChanels = await contact_has_chanelModels.bulkCreate(contact_chanels);
            }

            return res.status(201).json({
                status: 201,
                message: 'Contacto creado',
                data: { contact_id: contact.id }
            });

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                status: 500,
                error: error.message
            })
        }
    };

    // update contact
    static async update(req, res) {
        const { first_name, last_name, job, company_id, email, city_id, address, interes, pixel } = req.body;
        const { contact_chanels } = req.body
        const updater_userid = req.user.user_id;

        try {
            const contact = await contactModels.update(
                {
                    first_name,
                    last_name,
                    job,
                    company_id,
                    email,
                    city_id,
                    address,
                    interes,
                    pixel,
                    updater_userid
                },
                {
                    where: { id: req.params.id }
                });

            if (!contact) {
                return res.status(404).json({
                    status: 404,
                    message: 'Id de Contacto no existe'
                });
            }

            if (contact_chanels) {
                const contactChanelsdelete = await contact_has_chanelModels.destroy({
                    where: {
                        contact_id: req.params.id
                    }
                });

                contact_chanels.forEach((chanel) => {
                    chanel.contact_id = req.params.id;
                });

                const contactChanelsCreate = await contact_has_chanelModels.bulkCreate(contact_chanels);
            }

            return res.status(202).json({
                status: 202,
                message: 'Contacto Actualizado'
            });

        } catch (error) {

            return res.status(500).json({
                status: 500,
                error: error.message
            })
        }
    };

    // delete contact by id
    static async delete(req, res) {

        try {
            const contactChanels = await contact_has_chanelModels.destroy({
                where: {
                    contact_id: req.params.id
                }
            });

            const contact = await contactModels.destroy({
                where: {
                    id: req.params.id
                }
            });

            if (!contact) {
                return res.status(404).json({
                    status: 404,
                    message: 'Contacto no existe'
                });
            }

            return res.status(202).json({
                status: 202,
                message: 'Contacto Eliminado'
            });

        } catch (error) {
            return res.status(500).json({
                status: 500,
                error: error.message
            })
        }
    };

    // search contact
    static async search(req, res) {
        let q = req.query.q;

        q = q.trim() + '%';

        console.log('buscar: ' + q);
        try {
            const contacts = await contactModels.findAll(
                {
                    include: [
                        {
                            model: userModels,
                            as: 'updater_user',
                            attributes:
                            {
                                exclude: ['password']
                            }
                        },
                        {
                            model: companyModels,
                            as: 'companies',
                        },
                        {
                            model: cityModels,
                            as: 'cities',
                            attributes: {
                                exclude: ['country_id']
                            },
                            include: [
                                {
                                    model: countryModels,
                                    as: 'countries',
                                    attributes: {
                                        exclude: ['region_id']
                                    },
                                    include: [
                                        {
                                            model: regionModels,
                                            as: 'regions'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            model: contact_has_chanelModels,
                            as: 'contact_has_chanels',
                            include: [
                                {
                                    model: contactChanelModels,
                                    as: 'contact_chanels',
                                    attributes: ['name']
                                },
                                {
                                    model: preferenceModels,
                                    as: 'preferences',
                                    attributes: ['name']
                                },
                            ],
                            attributes:
                            {
                                exclude: ['contact_id']
                            }
                        },
                    ],
                    attributes: {
                        exclude: ['updater_userid', 'company_id', 'city_id']
                    },
                    where: {
                        [Op.or]: [
                            {
                                first_name: {
                                    [Op.like]: q
                                }
                            },
                            {
                                last_name: {
                                    [Op.like]: q
                                }
                            },
                            {
                                job: {
                                    [Op.like]: q
                                }
                            },
                            {
                                email: {
                                    [Op.like]: q
                                }
                            },
                            {
                                address: {
                                    [Op.like]: q
                                }
                            },
                            {
                                company_id: {
                                    [Op.in]: [literal(`select id from companies where name like '${q}'`)]
                                }
                            },
                            ,
                            {
                                city_id: {
                                    [Op.in]: [literal(`select ci.id from cities ci
                                                       join countries co on ci.country_id = co.id
                                                       join regions re on re.id = co.region_id 
                                                       where ci.name like '${q}' or
                                                             co.name like '${q}' or
                                                             re.name like '${q}'`)]
                                }
                            }
                        ]
                    }
                }
            );
            return res.status(200).json({
                status: 200,
                data: contacts,
                control: {
                    total_count: contacts.length
                }
            });

        } catch (error) {
            return res.status(500).json({
                status: 500,
                error: error.message
            })
        }
    };


}

module.exports = Contact;
