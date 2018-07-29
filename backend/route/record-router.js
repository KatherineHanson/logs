'use strict'

// const multer = require('multer')
const { Router } = require('express')
const httpErrors = require('http-errors')
const Record = require('../model/record.js')
const bearerAuth = require('../lib/bearer-auth-middleware')

const apiURL = `${process.env.API_URL}`

let fuzzy = (filterTerm) => new RegExp('.*' + filterTerm.toLowerCase().split('').join('.*') + '.*')

module.exports = new Router()
  .post('/records', bearerAuth, (req, res, next) => {
    return new Record({ ...req.body, account: req.account._id })
      .save()
      .then(record => res.json(record))
      .catch(next)
  })

  .get('/records', bearerAuth, (req, res, next) => {
    // console.log(bearerAuth)
    let { page = '0' } = req.query
    delete req.query.page
    page = Number(page)
    if (isNaN(page))
      page = 0
    page = page < 0 ? 0 : page

    // Fuzzy Search
    if (req.query.description) req.query.description = ({ $regex: fuzzy(req.query.description), $options: 'i' })
    if (req.query.category) req.query.category = ({ $regex: fuzzy(req.query.category), $options: 'i' })

    let recordsCache
    Record.find({...req.query, account: req.account._id})
      .skip(page * 100)
      .limit(100)
      .then(records => {
        recordsCache = records
        return Record.find({ ...req.query, account: req.account._id }).count()
      })
      .then(count => {
        let result = {
          count,
          data: recordsCache,
        }

        let lastPage = Math.floor(count / 100)
        res.links({
          next: `${apiURL}/records?page=${page === lastPage ? lastPage : page+1}`,
          prev: `${apiURL}/records?page=${page < 1 ? 0 : page - 1}`,
          last: `${apiURL}/records?page=${lastPage}`,
        })
        res.json(result)
      })
      .catch(next)
  })

  .put('/records/:id', bearerAuth, (req, res, next) => {
    if (!req.body.description)
      return next(httpErrors(400, 'record description is required'))
    Record.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .then(record => {
        res.json(record)
      })
      .catch(next)
  })

  .delete('/records/:id', bearerAuth, (req, res, next) => {
    Record.findByIdAndRemove(req.params.id)
      .then(() => {
        res.sendStatus(204)
      })
      .catch(next)
  })
