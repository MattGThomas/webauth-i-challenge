const express = require('express')
const bcrypt = require('bcryptjs')

const db = require('../data/db-config.js')
const Users = require('./users-model.js')

const router = express.Router()



router.get('/', (req, res) => {
    res.send('its working')
})

router.post('/api/register', (req, res) => {
    let user = req.body
    console.log('this is the password and username combo',user.username, user.password)
    user.password = bcrypt.hashSync(user.password, 16)
    console.log('this is the password and username combo',user.username, user.password)
    Users.add(user)
        .then(saved => {
            res.status(201).json(saved)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

router.post('/api/login', (req, res) => {
    let { username, password } = req.body

    Users.getBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                res.status(200).json({
                    message: `Welcome ${user.username}, you have successfully logged in`
                })
            } else {
                res.status(401).json({
                    message: 'You shall not pass'
                })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

router.get('/api/users', checkCredentials, (req, res) => {
    Users.get()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.status(500).json({
                message: 'You shall not pass!'
            })
        })
})

function checkCredentials(req, res, next) {
    const { username, password } = req.headers

    if( username && password ) {
        Users.getBy({ username })
            .first()
            .then(user => {
                if(user && bcrypt.compareSync(password, user.password)) {
                    next()
                } else {
                    res.status(401).json({ 
                        message: 'you shall not pass' })
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: 'unexpected error'
                })
            })
    } else {
        res.status(400).json({
            message: 'You shall not pass'
        })
    }
}

module.exports = router;