'use strict'

require('dotenv').config()

const express = require('express')

express()
  .use(require('morgan')('common'))
  .use(express.static(`${__dirname}/frontend/build`))
  .get('*', (req, res) => res.sendFile(`${__dirname}/frontend/build/index.html`))
  .listen(process.env.PORT, () => {
    console.log('server up', process.env.PORT)
  })