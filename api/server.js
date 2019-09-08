const express = require('express')
const session = require('express-session')
const connectSessionKnex = require('connect-session-knex')

const UsersRouter = require('../users/users-router.js')
const authRouter = require('../auth/auth-router.js')
const db = require('../data/db-config.js')

const KnexSessionStore = connectSessionKnex(session)

const server = express()
server.use(express.json())

const sessionConfig = {
    name: 'new world orders',
    // this should not be hardcoded in
    secret: 'i am the lion sin of pride',
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false,
      httpOnly: true // the browser cant access via js
    },
    resave: false,
    saveUnitialized: false,
    //where do we store our sessions?
    store: new KnexSessionStore({
      knex: db,
      tablename: 'sessions',
      sidfieldname: 'sid',
      createtable: true,
      clearInterval: 1000 * 60 * 60
    })
}

server.use(session(sessionConfig))

server.use('/api/auth', authRouter)
server.use('/api/users', UsersRouter)


server.get('/', (req, res) => {
    res.json({ api: 'up' });
  });
  
module.exports = server