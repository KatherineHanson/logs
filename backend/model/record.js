'use strict'

const mongoose = require('mongoose')

const recordSchema = mongoose.Schema({
  description: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String },
  created: { type: Date, default: () => new Date() },
  account: { type: mongoose.Schema.Types.ObjectId, required: true },
})

module.exports = mongoose.model('record', recordSchema)
