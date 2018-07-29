'use strict'

const {Router} = require('express')
const Account = require('../model/account.js')
const basicAuth = require('../lib/basic-auth-middleware')

const authRouter = module.exports = new Router()

authRouter.post('/admin/signup', (req, res, next) => {
  Account.create(req.body)
    .then(account => account.tokenCreate())
    .then(token => {
      res.cookie('X-Witnesby-Token', token, {maxAge: 604800000})
      res.json({token})
    })
    .catch(next)
})

authRouter.get('/admin/login', basicAuth, (req, res, next) => {
  req.account.tokenCreate()
    .then(token => {
      res.cookie('X-Witnesby-Token', token, {maxAge: 604800000})
      res.json({token})
    })
    .catch(next)
})
