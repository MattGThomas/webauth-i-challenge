
module.exports = (req, res, next) => {

    if (req.session && req.session.user) {
        next()
    } else {
        res.status(500).json({
            message: 'invalid credentials'
        })
    }
}