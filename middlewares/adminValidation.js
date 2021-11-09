
function adminValidation(req, res, next) {
    try {

        if (!req.user.is_admin) {
            throw { status: 403, message: 'unauthorized user' };
        }

        next();

    } catch (error) {
        return res.status(error.status || 500).json({
            status: error.status || 500,
            error: error.message || "Internal server error"
        });
    }
}

module.exports =  adminValidation;