
function verifyContact(req, res, next) {
    const { first_name, last_name, job, company_id, email, city_id, address, interes, pixel } = req.body;
    const { contact_chanels } = req.body

    try {
        if (!first_name) {
            return res.status(422).json({
                status: 422,
                error: 'Nombre requerido '
            });
        };

        if (!last_name) {
            return res.status(422).json({
                status: 422,
                error: 'Apellido es requerido'
            });
        };

        if (!job) {
            return res.status(422).json({
                status: 422,
                error: 'Cargo es requerido '
            });
        };

        if (!company_id) {
            return res.status(422).json({
                status: 422,
                error: 'Compañia es requerida '
            });
        };

        if (!address) {
            return res.status(422).json({
                status: 422,
                error: 'Direccion es requerida'
            });
        };

        if (!email) {
            return res.status(422).json({
                status: 422,
                error: 'Email es requerida'
            });
        };

        if (!city_id) {
            return res.status(422).json({
                status: 422,
                error: 'Ciudad es requerida'
            });
        };

        if (!interes) {
            return res.status(422).json({
                status: 422,
                error: 'Interés es requerido'
            });
        };

        // if (!contact_chanels) {
        //     return res.status(422).json({
        //         status: 422,
        //         error: 'Canal de Contacto es requerido '
        //     });
        // };

        // let contactChanelError = false;
        // let contactChanelErrorMessage = '';
        // contact_chanels.forEach(chanel => {
        //     const { contact_chanel_id, user_account, preference_id } = chanel;

        //     if (!contact_chanel_id) {
        //         contactChanelError = true;
        //         contactChanelErrorMessage = `Canal de Contacto es requerido`;
        //         return;
        //     }

        //     if (!user_account) {
        //         contactChanelError = true;
        //         contactChanelErrorMessage = `Cuenta de Usuario es requerida`;
        //         return;
        //     }

        //     if (!preference_id) {
        //         contactChanelError = true;
        //         contactChanelErrorMessage = `Preferencia es requerida`;
        //         return;
        //     };
        // });

        // if (contactChanelError) {
        //     return res.status(422).json({
        //         status: 422,
        //         error: contactChanelErrorMessage
        //     });
        // }

        next();

    } catch (error) {
        let message = error.message;

        return res.status(500).json({
            status: 500,
            error: message
        });
    }
}

module.exports = verifyContact;