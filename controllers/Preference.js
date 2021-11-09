
const preferenceModels = require('../models/preferences');


class ContactChanel {

    // get all Contact Chanel
    static async getAll(req, res) {

        try {

            const preferences = await preferenceModels.findAll();

            return res.status(200).json({
                status: 200,
                data: preferences,
                control: {
                    total_count: preferences.length
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
