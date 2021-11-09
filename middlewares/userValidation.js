
// validate that the user ID belongs to the user's login
function userValidation(req, res, next) {
    try {
        const {user_id, is_admin} = req.user; //login data

        if (req.params.user_id != user_id && !is_admin) {
            return res.status(403).json({
                status: 403,
                error: 'unauthorized user'
            });
        }

        next();

    } catch (error) {
        let message = error.message;

        return res.status(500).json({
            status: 500,
            error: message
        });
    }
}

module.exports =  userValidation;