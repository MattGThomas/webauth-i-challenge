const router = require('express').Router()
const bcrypt = require('bcryptjs')


const Users = require('./users-model.js')
const restricted = require('../auth/midware.js')



router.get('/', restricted, (req, res) => {
    Users.find()
        .then(users => {
            res.json(users)
        })
        .catch(err => res.send(err))
})



module.exports = router;