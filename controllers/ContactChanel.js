
const contactChanelModels = require('../models/contact_chanels');


class ContactChanel {

    // get all Contact Chanel
    static async getAll(req, res) {

        try {

            const contactChanel = await contactChanelModels.findAll();

            return res.status(200).json({
                status: 200,
                data: contactChanel,
                control: {
                    total_count: contactChanel.length
                }
            });

        } catch (error) {

            return res.status(error.status || 500).json({
                status: error.status || 500,
                error: error.message || "Internal server error"
            });
        }

    };

};

module.exports = ContactChanel;
